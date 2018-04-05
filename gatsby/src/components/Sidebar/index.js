import React from 'react'
import SidebarItem from '../SidebarItem'

import { links } from './links'

const Sidebar = () => {
  const items = links.map(link => <SidebarItem {...link} />)

  return <ul className="social-list list-unstyled">{items}</ul>
}

export default Sidebar
