/*
 *   Copyright (c) 2022 
 *   All rights reserved.
 */
import './Links.css';
import React, { useState, useEffect, useCallback } from 'react'
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from "@mui/material/styles";
import { firebaseService } from '../FirebaseService';

const CardContentCustomPadding = styled(CardContent)(`
  padding: 15px 20px;
  &:last-child {
    padding-bottom: 15px;
  }
`);

// const Link = props => (
//     <div className="link">{props.name} <a href={props.url} {...(props.newTab && { target: '_blank', rel: 'noreferrer' })}>{props.url}</a></div>
// );
const Link = ({ link }) => (
    <Card className='card'>
        <CardContentCustomPadding>
            <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom variant="caption">
                {link.name}
            </Typography>
            {link.description && <Typography variant="subtitle2">
                {link.description}
            </Typography>}
            {link.tags && <div>
                Tags: {link.tags.map(tag => (<Chip key={tag} sx={{ p: '0', m: '0 2px' }} label={tag} size="small" />))}
            </div>}
            {link.keywords && <div>
                Keywords: {link.keywords.map(keyword => (<Chip key={keyword} sx={{ p: '0', m: '0 2px' }} label={keyword} size="small" />))}
            </div>}
            {link.url && <Typography variant="body2">
                <a key={link.url} href={link.url} {...(link.newTab && { target: '_blank', rel: 'noreferrer' })}>{link.url}</a>
            </Typography>}
        </CardContentCustomPadding>
        <div className="cardActionBar">
            <IconButton aria-label="bookmark" variant="plain" size="sm">
                <MoreVertIcon />
            </IconButton>
        </div>
    </Card>
);
Link.propTypes = {};

const Links = () => {

    const [linksList, setLinksList] = useState(null);

    const getLinks = useCallback(async () => setLinksList(await firebaseService.getDocs("links")), []);

    useEffect(() => {
        getLinks()
    }, [getLinks]);

    return (
        <>
            {!linksList && <div className="loadingWrapper"><LinearProgress /><div>Loading links...</div></div>}
            <div className='links'>
                {linksList && linksList.map(link => <Link key={link.url} link={link} name={link.name} url={link.url} newTab={link.newTab} />)}
            </div>
        </>
    )
};

export default Links;
