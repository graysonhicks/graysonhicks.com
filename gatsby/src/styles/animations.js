import styled, { keyframes } from 'styled-components'

export const slideLeft = keyframes`
  from {
    left: 100%;
    opacity: 0;
  }

  to {
    left: 0;
    opacity: 1;
  }
`

export const slideRight = keyframes`
  from {
    left: 0;
    opacity: 1;
  }

  to {
    left: 100%;
    opacity: 0;
  }
`
