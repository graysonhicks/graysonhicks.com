import React from 'react'
import styled from 'styled-components'
import { links } from './links'
import { colors } from '../../styles/colors'

import AppContext from '../../context'

import SidebarItem from './SidebarItem'

const List = styled.ul`
  border-right: 1px solid
    ${props => (props.nightMode ? colors.white : colors.gray)};

  @media screen and (max-width: 991px) {
    border-right: none;
    border-top: 1px solid
      ${props => (props.nightMode ? colors.white : colors.gray)};
    padding-top: 10px;
    display: inline-block;
    width: 100%;
  }
`

const Sidebar = () => {
  const items = links.map(link => <SidebarItem key={link.name} {...link} />)

  return (
    <AppContext.Consumer>
      {context => (
        <List nightMode={context.nightMode} className="list-unstyled">
          {items}
        </List>
      )}
    </AppContext.Consumer>
  )
}

export default Sidebar
