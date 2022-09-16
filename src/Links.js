import React from 'react'
// import PropTypes from 'prop-types'

const Link = props => (
    <div className="link">{props.name} <a href={props.url} {...(props.newTab && { target: '_blank', rel: 'noreferrer' })}>{props.url}</a></div>
)
Link.propTypes = {}

const links = [
    { name: 'Google', url: 'http://google.com', newTab: true },
    { name: 'Gmail', url: 'http://gmail.com', newTab: false },
];

const Links = () => {
    return (
        <div className="links">
            {links.map(link => <Link key={link.url} name={link.name} url={link.url} newTab={link.newTab} />)}
        </div>
    )
}

export default Links
