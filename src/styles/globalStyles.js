import { injectGlobal } from 'styled-components'
import LatoBold from './fonts/Lato-Bold.ttf'

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

    @font-face {
        font-family: 'Lato';
        font-style: bold;
        font-weight: 700;
        src: local('Lato'),
            url(${LatoBold}) format('truetype')
        }

`
