'use client'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as styles from './index.module.scss'
import { colors } from '../../../styles/colors'
import { TiFlowChildren } from 'react-icons/ti'

const RepoItem = `${styles.repoItem}`

const RepoLink = `${styles.repoLink}`

const RepoHeading = `${styles.repoHeading}`

const RepoText = `${styles.repoText}`

const getRepoLanguageColor = (language) => {
  let color = ''
  switch (language) {
    case 'JavaScript':
      color = colors.casablanca
      break
    case 'CSS':
      color = colors.butterflyBush
      break
    case 'HTML':
      color = colors.pueblo
      break
    case 'API Blueprint':
      color = colors.fruitSalad
      break
    case 'PHP':
      color = colors.royalBlue
      break
    case 'Ruby':
      color = colors.japonica
      break
    default:
      color = colors.bismark
      break
  }

  return color
}

const RepoLanguage = ({ language }) => {
  const languageColor = getRepoLanguageColor(language)

  return (
    <div className={styles.repoLanguage}>
      <span style={{ backgroundColor: languageColor }} />
      {language}
    </div>
  )
}

const RepoIcon = ({ hover }) => (
  <TiFlowChildren
    className={`${styles.repoIcon}`}
    style={{ color: hover ? colors.royalBlue : colors.mineShaft }}
  />
)

const Repo = ({ url, language, description, name }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`${RepoItem}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a className={RepoLink} href={url} target="_blank" rel="noopener">
        <div className={RepoHeading}>
          <RepoIcon hover={isHovered} />
          {name}
        </div>
        <div className={RepoText}>{description}</div>
        {language && <RepoLanguage language={language} />}
      </a>
    </div>
  )
}

export default Repo

Repo.propTypes = {
  url: PropTypes.string.isRequired,
  language: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string.isRequired,
}

RepoLanguage.propTypes = {
  language: PropTypes.string.isRequired,
}

RepoIcon.propTypes = {
  hover: PropTypes.bool.isRequired,
}
