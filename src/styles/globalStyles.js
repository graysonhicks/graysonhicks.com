import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    *::before,
    *::after {
        box-sizing: border-box;
    }

    html {
        font-size: 10px !important;
    }

    body,
    html {
        overflow-x: hidden;
    }

    img {
        max-width: 100%;
    }

`
export default GlobalStyle
