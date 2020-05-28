import React from 'react';
import styled from 'styled-components';

const handleFontSize = level => {
  switch (level) {
    case 1:
      return '3rem';
    default:
      return '2rem';
  }
};

export const StyledHeading = styled.h2`
  font-family: 'Futura';
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: ${({ level }) => handleFontSize(level)};
`;

const Heading = ({ level, children }) => (
  <StyledHeading level={level} as={`h${level}`}>
    {children}
  </StyledHeading>
);

export default Heading;

Heading.defaultProps = {
  level: 2,
};
