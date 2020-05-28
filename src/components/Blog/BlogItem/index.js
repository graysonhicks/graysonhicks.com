import React from 'react'
import { Link } from 'gatsby'

import Img from 'gatsby-image'

import styled from 'styled-components'
import { colors } from '../../../styles/colors'

import AppContext from '../../../context'

import { StyledHeading } from '../../Heading'

const BlogItem = ({ id, childMdx, prefix }) => {
  console.log(childMdx)

  return (
    <AppContext.Consumer>
      {context => (
        <BlogPost
          nightMode={context.nightMode}
          to={`${prefix}${childMdx.frontmatter.slug}`}
        >
          <div className="col-xs-12">
            <BlogTitle>{childMdx.frontmatter.title}</BlogTitle>
            <BlogDescription>
              {childMdx.frontmatter.description}
            </BlogDescription>
          </div>
        </BlogPost>
      )}
    </AppContext.Consumer>
  )
}

export default BlogItem

export const BlogPost = styled(Link)`
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  color: ${props => (props.nightMode ? colors.gallery : colors.black)};

  &:hover,
  &:visited {
    text-decoration: none;
    color: ${props => (props.nightMode ? colors.gallery : colors.black)};
  }

  @media screen and (max-width: 991px) {
    display: inline-block;
    width: 50%;
    float: left;
    height: 350px;
    padding: 10px;
    border-bottom: none;
    padding: 0px;
  }

  @media screen and (max-width: 736px) {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: 25px;
  }
`

export const BlogTitle = styled(StyledHeading)`
  font-size: 2.5rem;
  margin-bottom: 0px;
  font-weight: 700;
  letter-spacing: -0.25px;

  @media screen and (max-width: 991px) {
    font-size: 2rem;
  }
`

export const BlogDescription = styled.div`
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.25;
`
