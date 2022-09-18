/*
 *   Copyright (c) 2022 
 *   All rights reserved.
 */
import React, { useState, useEffect, useCallback } from 'react'
import { firebaseService } from '../FirebaseService';
// import PropTypes from 'prop-types'

const Link = props => (
    <div className="link">{props.name} <a href={props.url} {...(props.newTab && { target: '_blank', rel: 'noreferrer' })}>{props.url}</a></div>
)
Link.propTypes = {}

const Links = () => {

    const [linksList, setLinksList] = useState([]);

    const getLinks = useCallback(async () => setLinksList(await firebaseService.getDocs("links")), []);

    useEffect(() => {
        getLinks()
    }, [getLinks]);

    return (
        <div className="links">
            {linksList.map(link => <Link key={link.url} name={link.name} url={link.url} newTab={link.newTab} />)}
        </div>
    )
}

export default Links
