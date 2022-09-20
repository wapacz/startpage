/*
 *   Copyright (c) 2022 
 *   All rights reserved.
 */
import './Links.css';
import React, { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
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
    <Card sx={{ display: 'inline-block', width: '100%' }}>
        <CardContentCustomPadding>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom variant="caption">
                {link.name}
            </Typography>
            {link.description && <Typography variant="subtitle1">
                {link.description}
            </Typography>}
            {link.url && <Typography variant="body2">
                <a href={link.url} {...(link.newTab && { target: '_blank', rel: 'noreferrer' })}>{link.url}</a>
            </Typography>}
        </CardContentCustomPadding>
    </Card>
);
Link.propTypes = {};

const Links = () => {

    const [linksList, setLinksList] = useState([]);

    const getLinks = useCallback(async () => setLinksList(await firebaseService.getDocs("links")), []);

    useEffect(() => {
        getLinks()
    }, [getLinks]);

    return (
        <div className='links'>
            {linksList.map(link => <Link key={link.url} link={link} name={link.name} url={link.url} newTab={link.newTab} />)}
        </div>
    )
};

export default Links;
