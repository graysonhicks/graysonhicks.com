import React from 'react'
import PropTypes from 'prop-types'
import styled, { css, keyframes } from 'styled-components'
import { colors } from '../../../styles/colors'

import { Link } from 'gatsby'

const InternalLink = ({ href, name, ...rest }) => (
  <ListItem>
    <StyledGatsbyLink activeClassName="active" exact="true" to={href} {...rest}>
      {name}
    </StyledGatsbyLink>
  </ListItem>
)

InternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

const ExternalLink = ({ name, ...rest }) => (
  <ListItem>
    <ListItemLink {...rest}>{name}</ListItemLink>
  </ListItem>
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

const linkStyles = css`
  color: ${(props) => (props.nightmode ? colors.gallery : colors.black)};
  text-decoration: none;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Lato';
  font-size: 1.75rem;

  &:hover,
  &:focus {
    text-decoration: none;
  }
  @media screen and (max-width: 991px) {
    font-size: 1.25rem;
  }
`

const ListItemLink = styled.a`
  ${linkStyles};
`

const fadeIn = keyframes`
    from {
        opacity: 0
    }

    to {
        opacity: 1
    }
`

const StyledGatsbyLink = styled(Link)`
  ${linkStyles};

  &.active {
    color: ${(props) => (props.nightmode ? colors.gallery : colors.bismark)};

    @media screen and (min-width: 991px) {
      &:after {
        content: '';
        animation: ${fadeIn} 0.5s ease-in-out;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-left: 10px;
        background: ${(props) =>
          props.nightmode ? colors.gallery : colors.bismark};
        display: inline-block;
      }
    }

    @media screen and (max-width: 991px) {
      text-decoration: underline;
    }
  }
`

const ListItem = styled.li`
  @media screen and (max-width: 991px) {
    float: left;
    width: 25%;
    text-align: center;
    font-size: 2rem;
  }
`
