import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import * as styles from './index.module.scss'

const InternalLink = ({ href, name, ...rest }) => (
  <li className={styles.listItem}>
    <Link
      activeClassName={styles.active}
      exact="true"
      to={href}
      className={styles.link}
      {...rest}
    >
      {name}
    </Link>
  </li>
)

InternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

const ExternalLink = ({ name, ...rest }) => (
  <li className={styles.listItem}>
    <a className={styles.link} {...rest}>
      {name}
    </a>
  </li>
)

ExternalLink.propTypes = {
  name: PropTypes.string.isRequired,
}

const SidebarItem = (props) => {
  const internal = /^\/(?!\/)/.test(props.href)
  if (internal && props.id !== 'resume-link') {
    return <InternalLink {...props} />
  } else {
    return <ExternalLink {...props} />
  }
}

export default SidebarItem
