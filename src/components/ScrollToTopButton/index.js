import React from 'react'
import styled from 'styled-components'
import ScrollTop from 'react-scrolltop-button'

import { colors } from '../../styles/colors'

const StyledScrollTop = styled(ScrollTop)`
  background: ${colors.white};
  border: 2px solid ${colors.mineShaft};
  font-family: 'Futura';
  font-weight: bold;
  color: ${colors.black};

  &:hover {
    background-color: ${colors.scienceBlue};
    color: ${colors.gallery};
    border-color: ${colors.blueWhale};
  }
`
export default StyledScrollTop
