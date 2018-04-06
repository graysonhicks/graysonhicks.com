import { injectGlobal } from 'styled-components'

injectGlobal`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    img {
        max-width: 100%;
    }
`
