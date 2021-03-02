import React from 'react'
import styled from 'styled-components'
import { links } from './links'
import { colors } from '../../styles/colors'

import SidebarItem from './SidebarItem'

const List = styled.ul`
  border-right: 1px solid
    ${(props) => (props.nightmode ? colors.white : colors.gray)};

  @media screen and (max-width: 991px) {
    border-right: none;
    border-top: 1px solid
      ${(props) => (props.nightmode ? colors.white : colors.gray)};
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
`

const Sidebar = () => {
  const items = links.map((link) => <SidebarItem key={link.name} {...link} />)

  return (
    <nav role="navigation">
      <List className="list-unstyled">{items}</List>
    </nav>
  )
}

export default Sidebar
