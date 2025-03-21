import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/Layout'
import Heading from '../components/Heading'
import Paragraph from '../components/Paragraph'
import Projects from '../components/Projects'
import Interests from '../components/Interests'
import TextLink from '../components/TextLink'
import * as styles from '../styles/index.module.scss'

const IndexPage = () => (
  <Layout>
    <div className={styles.mainContent}>
      <div className={`row ${styles.row}`}>
        <div className={`col-12 ${styles.col12}`}>
          <Heading>about</Heading>
          <Paragraph>
            No matter the platform or language, I like to build software (dreams
            of hardware, too). I am interested in and passionate about solving
            problems with all things technical. I enjoy{' '}
            <Link className={styles.gatsbyLink} to="/blog">
              writing
            </Link>{' '}
            about technology and giving{' '}
            <Link className={styles.gatsbyLink} to="/talks">
              talks
            </Link>
            .
          </Paragraph>
          <Paragraph>
            I am currently the senior lead front-end engineer for{' '}
            <TextLink href="https://www.manufactured.com">Manufactured, Inc.</TextLink>, helping
            enterprises bring their physical products to life and finance their growth. I live outside New
            Orleans, LA with my wife, four sons, and one daughter. We love gardening, hiking, lacrosse and catching salamanders.
          </Paragraph>
        </div>
      </div>
      <div className={`row ${styles.row}`}>
        <div className={`col-12 ${styles.col12}`}>
          <Heading>current interests</Heading>
          <Paragraph>
            These are my favorite things I am presently learning or actively
            making an effort to include in projects/work:
          </Paragraph>
          <Interests />
        </div>
      </div>
      <div className={`row ${styles.row}`}>
        <div className={`col-12 ${styles.col12}`}>
          <Projects />
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
