import React from 'react'
import GatsbyLink from 'gatsby-link'

const InternalLink = ({ href, linkName, ...rest }) => (
  <li className="social-list-items">
    <GatsbyLink to={href} {...rest}>
      {linkName}
    </GatsbyLink>
  </li>
)

const ExternalLink = ({ linkName, ...rest }) => (
  <li className="social-list-items">
    <a {...rest}>{linkName}</a>
  </li>
)

const SidebarItem = props => {
  const internal = /^\/(?!\/)/.test(props.href)
  console.log(internal)

  if (internal) {
    return <InternalLink {...props} />
  } else {
    return <ExternalLink {...props} />
  }
}

export default SidebarItem
