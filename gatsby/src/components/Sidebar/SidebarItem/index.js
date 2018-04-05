import React from 'react'
import styled, { css } from 'styled-components'
import GatsbyLink from 'gatsby-link'

const linkStyles = css`
  color: black;
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Lato';
  font-size: 1.75rem;
  @media screen and (max-width: 991px) {
    font-size: 1.25rem;
  }
`

const ListItemLink = styled.a`
  ${linkStyles};
`

const StyledGatsbyLink = styled(GatsbyLink)`
  ${linkStyles};
`

const ListItem = styled.li`
  @media screen and (max-width: 991px) {
    float: left;
    width: 16.5%;
    text-align: center;
  }
`

const InternalLink = ({ href, name, ...rest }) => (
  <ListItem>
    <StyledGatsbyLink to={href} {...rest}>
      {name}
    </StyledGatsbyLink>
  </ListItem>
)

const ExternalLink = ({ name, ...rest }) => (
  <ListItem>
    <ListItemLink {...rest}>{name}</ListItemLink>
  </ListItem>
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
