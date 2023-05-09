import React from 'react'
import { links } from './links'
import SidebarItem from './SidebarItem'
import * as styles from './index.module.scss'

const Sidebar = () => {
  const items = links.map((link) => <SidebarItem key={link.name} {...link} />)

  return (
    <nav role="navigation">
      <ul className={`${styles.list} list-unstyled`}>{items}</ul>
    </nav>
  )
}

export default Sidebar
