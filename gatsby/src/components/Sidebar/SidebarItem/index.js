import React from 'react'
import styled, { css } from 'styled-components'
import { colors } from '../../../styles/colors'

import AppContext from '../../../context'

import GatsbyLink from 'gatsby-link'

const linkStyles = css`
  color: ${props => (props.nightMode ? colors.gallery : colors.black)};
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Lato';
  font-size: 1.75rem;

  &:hover {
    text-decoration: none;
  }
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
    <AppContext.Consumer>
      {context => (
        <StyledGatsbyLink nightMode={context.nightMode} to={href} {...rest}>
          {name}
        </StyledGatsbyLink>
      )}
    </AppContext.Consumer>
  </ListItem>
)

const ExternalLink = ({ name, ...rest }) => (
  <ListItem>
    <AppContext.Consumer>
      {context => (
        <ListItemLink nightMode={context.nightMode} {...rest}>
          {name}
        </ListItemLink>
      )}
    </AppContext.Consumer>
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
