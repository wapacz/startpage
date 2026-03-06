/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderFolder(folderNode, indent) {
    const pad = '    '.repeat(indent);
    let html = `${pad}<DT><H3>${escapeHtml(folderNode.name)}</H3>\n`;
    html += `${pad}<DL><p>\n`;
    for (const child of folderNode.children) {
        html += renderFolder(child, indent + 1);
    }
    for (const link of folderNode.links) {
        html += renderLink(link, indent + 1);
    }
    html += `${pad}</DL><p>\n`;
    return html;
}

function renderLink(link, indent) {
    const pad = '    '.repeat(indent);
    const attrs = [`HREF="${escapeHtml(link.url)}"`];
    if (link.description) {
        attrs.push(`DESCRIPTION="${escapeHtml(link.description)}"`);
    }
    if (link.tags?.length) {
        attrs.push(`TAGS="${escapeHtml(link.tags.join(','))}"`);
    }
    if (link.keywords?.length) {
        attrs.push(`KEYWORDS="${escapeHtml(link.keywords.join(','))}"`);
    }
    if (link.context && link.context !== 'both') {
        attrs.push(`CONTEXT="${escapeHtml(link.context)}"`);
    }
    if (link.pinned) {
        attrs.push('PINNED="true"');
    }
    if (link.tileGroup) {
        attrs.push(`TILE_GROUP="${escapeHtml(link.tileGroup)}"`);
    }
    if (link.sortOrder) {
        attrs.push(`SORT_ORDER="${link.sortOrder}"`);
    }
    if (link.iconType) {
        attrs.push(`ICON_TYPE="${escapeHtml(link.iconType)}"`);
    }
    if (link.icon && link.icon !== 'globe') {
        attrs.push(`ICON="${escapeHtml(link.icon)}"`);
    }
    if (link.faviconUrl) {
        attrs.push(`ICON_URI="${escapeHtml(link.faviconUrl)}"`);
    }
    if (link.newTab === false) {
        attrs.push('NEW_TAB="false"');
    }
    return `${pad}<DT><A ${attrs.join(' ')}>${escapeHtml(link.name)}</A>\n`;
}

export function exportBookmarks(tree) {
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`;
    for (const folder of tree.rootFolders) {
        html += renderFolder(folder, 1);
    }
    if (tree.rootLinks.length > 0) {
        for (const link of tree.rootLinks) {
            html += renderLink(link, 1);
        }
    }
    html += `</DL><p>\n`;
    return html;
}

export function downloadBookmarks(tree) {
    const html = exportBookmarks(tree);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bookmarks.html';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

export function parseBookmarksFile(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const folders = [];
    const links = [];
    let folderId = 0;

    function parseDL(dlElement, parentId) {
        if (!dlElement) return;
        const children = dlElement.children;
        for (let i = 0; i < children.length; i++) {
            const dt = children[i];
            if (dt.tagName !== 'DT') continue;

            const heading = dt.querySelector(':scope > H3');
            if (heading) {
                const currentFolderId = `import_${++folderId}`;
                folders.push({
                    _importId: currentFolderId,
                    name: heading.textContent.trim(),
                    parentId: parentId || null,
                });
                const nestedDl = dt.querySelector(':scope > DL');
                if (nestedDl) {
                    parseDL(nestedDl, currentFolderId);
                }
                continue;
            }

            const anchor = dt.querySelector(':scope > A');
            if (anchor) {
                const href = anchor.getAttribute('HREF') || anchor.getAttribute('href');
                if (!href) continue;

                const name = anchor.textContent.trim() || href;
                const description = anchor.getAttribute('DESCRIPTION') || null;
                const tagsRaw = anchor.getAttribute('TAGS');
                const keywordsRaw = anchor.getAttribute('KEYWORDS');
                const context = anchor.getAttribute('CONTEXT') || 'both';
                const pinned = anchor.getAttribute('PINNED') === 'true';
                const tileGroup = anchor.getAttribute('TILE_GROUP') || null;
                const sortOrderRaw = anchor.getAttribute('SORT_ORDER');
                const iconType = anchor.getAttribute('ICON_TYPE') || 'heroicon';
                const icon = anchor.getAttribute('ICON') || 'globe';
                const faviconUrl = anchor.getAttribute('ICON_URI') || null;
                const newTabRaw = anchor.getAttribute('NEW_TAB');

                links.push({
                    name,
                    url: href,
                    description,
                    tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [],
                    keywords: keywordsRaw ? keywordsRaw.split(',').map(k => k.trim()).filter(Boolean) : [],
                    context,
                    newTab: newTabRaw === 'false' ? false : true,
                    pinned,
                    icon,
                    iconType,
                    faviconUrl,
                    tileGroup,
                    sortOrder: sortOrderRaw ? Number(sortOrderRaw) : 0,
                    _importFolderId: parentId || null,
                });
            }
        }
    }

    const rootDl = doc.querySelector('DL');
    parseDL(rootDl, null);

    return { folders, links };
}
