import { injectGlobal } from 'styled-components'

injectGlobal`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    body,
    html {
        overflow-x: hidden;
    }

    img {
        max-width: 100%;
    }
`
