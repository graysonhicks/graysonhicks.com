import React from 'react'
import styled from 'styled-components'
import { links } from './links'

import SidebarItem from './SidebarItem'

const List = styled.ul`
  border-right: 1px solid gray;

  @media screen and (max-width: 991px){
    border-right: none
    border-top: 1px solid gray
    padding-top: 10px
    display: inline-block
    width: 100%
  }
`

const Sidebar = () => {
  const items = links.map(link => <SidebarItem key={link.name} {...link} />)

  return <List className="list-unstyled">{items}</List>
}

export default Sidebar
