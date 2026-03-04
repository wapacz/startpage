/*
 *   Copyright (c) 2022
 *   All rights reserved.
 */
import React, { useState } from 'react';
import {
    HiOutlineGlobe, HiOutlineMail, HiOutlineChat, HiOutlineCalendar,
    HiOutlineFolder, HiOutlineDatabase, HiOutlineServer, HiOutlineCode,
    HiOutlineTerminal, HiOutlineChartBar, HiOutlineDocumentText, HiOutlineCog,
    HiOutlineCloud, HiOutlineShieldCheck, HiOutlineLightningBolt, HiOutlineLink,
    HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlineDesktopComputer, HiOutlineVideoCamera,
    HiOutlinePhotograph, HiOutlineMusicNote, HiOutlineHeart, HiOutlineStar,
    HiOutlineClipboardList, HiOutlineBriefcase, HiOutlineOfficeBuilding, HiOutlineHome,
    HiOutlineTruck, HiOutlineCube, HiOutlineKey, HiOutlineUserGroup,
    HiOutlineCash, HiOutlineShoppingCart, HiOutlineBeaker, HiOutlineChip,
} from 'react-icons/hi';

export const AVAILABLE_ICONS = {
    globe: { component: HiOutlineGlobe, label: 'Globe' },
    mail: { component: HiOutlineMail, label: 'Mail' },
    chat: { component: HiOutlineChat, label: 'Chat' },
    calendar: { component: HiOutlineCalendar, label: 'Calendar' },
    folder: { component: HiOutlineFolder, label: 'Folder' },
    database: { component: HiOutlineDatabase, label: 'Database' },
    server: { component: HiOutlineServer, label: 'Server' },
    code: { component: HiOutlineCode, label: 'Code' },
    terminal: { component: HiOutlineTerminal, label: 'Terminal' },
    chart: { component: HiOutlineChartBar, label: 'Chart' },
    document: { component: HiOutlineDocumentText, label: 'Document' },
    settings: { component: HiOutlineCog, label: 'Settings' },
    cloud: { component: HiOutlineCloud, label: 'Cloud' },
    shield: { component: HiOutlineShieldCheck, label: 'Shield' },
    lightning: { component: HiOutlineLightningBolt, label: 'Lightning' },
    link: { component: HiOutlineLink, label: 'Link' },
    book: { component: HiOutlineBookOpen, label: 'Book' },
    academic: { component: HiOutlineAcademicCap, label: 'Academic' },
    desktop: { component: HiOutlineDesktopComputer, label: 'Desktop' },
    video: { component: HiOutlineVideoCamera, label: 'Video' },
    photo: { component: HiOutlinePhotograph, label: 'Photo' },
    music: { component: HiOutlineMusicNote, label: 'Music' },
    heart: { component: HiOutlineHeart, label: 'Heart' },
    star: { component: HiOutlineStar, label: 'Star' },
    clipboard: { component: HiOutlineClipboardList, label: 'Clipboard' },
    briefcase: { component: HiOutlineBriefcase, label: 'Briefcase' },
    office: { component: HiOutlineOfficeBuilding, label: 'Office' },
    home: { component: HiOutlineHome, label: 'Home' },
    truck: { component: HiOutlineTruck, label: 'Truck' },
    cube: { component: HiOutlineCube, label: 'Cube' },
    key: { component: HiOutlineKey, label: 'Key' },
    users: { component: HiOutlineUserGroup, label: 'Users' },
    cash: { component: HiOutlineCash, label: 'Cash' },
    cart: { component: HiOutlineShoppingCart, label: 'Cart' },
    beaker: { component: HiOutlineBeaker, label: 'Beaker' },
    chip: { component: HiOutlineChip, label: 'Chip' },
};

export function getIconComponent(iconName) {
    return AVAILABLE_ICONS[iconName]?.component || HiOutlineGlobe;
}

export default function IconPicker({ selectedIcon, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const SelectedIconComponent = getIconComponent(selectedIcon);

    return (
        <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">Icon</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg
                           text-white hover:border-gray-600 transition-colors w-full"
            >
                <SelectedIconComponent size={20} />
                <span className="text-sm">{AVAILABLE_ICONS[selectedIcon]?.label || 'Globe'}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl
                                shadow-xl z-20 p-3 grid grid-cols-6 gap-1 w-72">
                    {Object.entries(AVAILABLE_ICONS).map(([key, { component: IconComp, label }]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => { onSelect(key); setIsOpen(false); }}
                            className={`p-2 rounded-lg flex flex-col items-center gap-0.5 transition-colors ${
                                selectedIcon === key
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                            title={label}
                        >
                            <IconComp size={20} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
