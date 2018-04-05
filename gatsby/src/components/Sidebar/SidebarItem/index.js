import React from 'react'
import GatsbyLink from 'gatsby-link'

const InternalLink = ({ href, name, ...rest }) => (
  <li className="social-list-items">
    <GatsbyLink to={href} {...rest}>
      {name}
    </GatsbyLink>
  </li>
)

const ExternalLink = ({ name, ...rest }) => (
  <li className="social-list-items">
    <a {...rest}>{name}</a>
  </li>
)

const SidebarItem = props => {
  const internal = /^\/(?!\/)/.test(props.href)
  if (internal) {
    return <InternalLink {...props} />
  } else {
    return <ExternalLink {...props} />
  }
}

export default SidebarItem
