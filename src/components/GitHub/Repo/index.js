import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../../styles/colors';
import { hexToRGB } from '../../../utils';
import TiFlowChildren from 'react-icons/lib/ti/flow-children';

const RepoItem = styled.div`
  border: 1px solid ${hexToRGB(colors.mineShaft, 0.15)};
  border-radius: 5px;
  box-shadow: 0 2px 2px 2px ${hexToRGB(colors.mineShaft, 0.15)};
  background: white;
  transition: transform 0.5s;
  padding: 15px;

  &:hover {
    transform: scale(1.025);
  }
`;

const StyledRepoLink = styled.a`
  display: inline-block;
  width: 100%;

  cursor: pointer;
  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

const RepoHeading = styled.div`
  color: ${props => (props.hover ? colors.royalBlue : colors.mineShaft)};
  font-weight: 600;
  transition: color 0.5s;
  text-align: center;
  width: 100%;
  height: 100%;
  padding: 25px calc(25% - 50px);
  font-family: 'Futura';
  text-transform: uppercase;
  font-size: 1.5rem;
`;

const RepoText = styled.div`
  color: ${colors.mineShaft};
  padding: 15px;
  z-index: 10;
`;

const getRepoLanguageColor = language => {
  let color = '';
  switch (language) {
    case 'JavaScript':
      color = colors.casablanca;
      break;
    case 'CSS':
      color = colors.butterflyBush;
      break;
    case 'HTML':
      color = colors.pueblo;
      break;
    case 'API Blueprint':
      color = colors.fruitSalad;
      break;
    case 'PHP':
      color = colors.royalBlue;
      break;
    case 'Ruby':
      color = colors.japonica;
      break;
    default:
      color = colors.bismark;
      break;
  }

  return color;
};
const RepoLanguage = styled.div`
color: ${colors.mineShaft}
  &:before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 10px;
    background: ${props => getRepoLanguageColor(props.language)};
    display: inline-block;
    margin-right: 5px;
  }
`;

const StyledRepoIcon = styled(TiFlowChildren)`
  color: ${props => (props.hover ? colors.royalBlue : colors.mineShaft)};
  font-weight: 600;
  transition: all 0.5s;
  font-size: 4rem;
`;

const Gradient = styled.div`
  transition: all 0.5s;
  background: linear-gradient(
    135deg,
    ${hexToRGB(colors.mineShaft, 0.7)} 0%,
    ${hexToRGB(colors.blueWhale, 0.5)} 50%,
    ${hexToRGB(colors.gallery, 0.4)} 100%
  );
  height: ${props => (props.hover ? '0%' : '100%')};
  width: 100%;
  position: absolute;
  top: 0;
  border-radius: 10px;
  opacity: ${props => (props.hover ? 0 : 1)};
`;

const Repo = ({ url, language, description, name }) => {
  const [isHovered, setIsHovered] = useState(0);
  const hoverItem = () => {
    setIsHovered(1);
  };
  const unHoverItem = () => {
    setIsHovered(0);
  };

  return (
    <RepoItem onMouseEnter={hoverItem} onMouseLeave={unHoverItem}>
      <StyledRepoLink href={url} target="_blank" rel="noopener">
        <RepoHeading hover={isHovered}>
          <StyledRepoIcon hover={isHovered} />
          {name}
        </RepoHeading>
        <RepoText>{description}</RepoText>
        {language && (
          <RepoLanguage language={language}>{language}</RepoLanguage>
        )}
      </StyledRepoLink>
    </RepoItem>
  );
};

export default Repo;
