import React from 'react'
import { FaGithub } from 'react-icons/fa'
import * as styles from './index.module.scss'
import { colors } from '../../../styles/colors'

const GithubIcon = () => <FaGithub className={styles.githubIcon} />

const GithubEndPost = () => (
  <a
    href="http://github.com/graysonhicks/"
    target="_blank"
    rel="noopener"
    className={styles.githubEndPost}
    style={{ borderColor: colors.scienceBlue, color: colors.scienceBlue }}
  >
    go to github <GithubIcon style={{ color: colors.scienceBlue }} />
  </a>
)

export default GithubEndPost
