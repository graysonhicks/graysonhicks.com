import React from 'react'
import { links } from './links'

import SidebarItem from './SidebarItem'

import './index.sass'

const Sidebar = () => {
  const items = links.map(link => <SidebarItem key={link.name} {...link} />)

  return <ul className="social-list list-unstyled">{items}</ul>
}

export default Sidebar
