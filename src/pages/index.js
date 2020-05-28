import React from 'react'
import styled from 'styled-components'
import { graphql, Link } from 'gatsby'

import Layout from '../components/Layout'
import Heading from '../components/Heading'
import Paragraph from '../components/Paragraph'
import Projects from '../components/Projects'
import Interests from '../components/Interests'
import TextLink from '../components/TextLink'
import { colors } from '../styles/colors'

const MainContent = styled.div`
  @media screen and (max-width: 991px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`

const GatsbyLink = styled(Link)`
  color: ${colors.jewel};
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: ${colors.seaGreen};
  }
`

const IndexPage = ({ data }) => (
  <Layout>
    <MainContent>
      <div className="row">
        <div className="col-xs-12">
          <Heading>about</Heading>
          <Paragraph>
            No matter the platform or language, I like to build software (dreams
            of hardware, too). I am interested in and passionate about solving
            problems with all things technical. I enjoy{' '}
            <GatsbyLink to="/blog">writing</GatsbyLink> about technology and
            giving <GatsbyLink to="/talks">talks</GatsbyLink>.
          </Paragraph>
          <Paragraph>
            I am currently a front-end developer for a{' '}
            <TextLink href="https://www.mediacurrent.com">
              full-service enterprise web agency
            </TextLink>
            , developing world-class web software. I live outside Brevard, NC
            with my wife, four sons, and one daughter. We love to garden, hike
            and catch salamanders.
          </Paragraph>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <Heading>current interests</Heading>
          <Paragraph>
            These are my favorite things I am presently learning or actively
            making an effort to include in projects/work:
          </Paragraph>
          <Interests />
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          <Heading>projects / work</Heading>
          <Projects projects={data.allProjectsJson.edges} />
        </div>
      </div>
    </MainContent>
  </Layout>
)

export default IndexPage

export const IndexQuery = graphql`
  query IndexQuery {
    allProjectsJson {
      edges {
        node {
          title
          description
          href
          image {
            childImageSharp {
              fluid(maxWidth: 400) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
