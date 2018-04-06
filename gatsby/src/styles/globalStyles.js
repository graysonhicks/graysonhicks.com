import { injectGlobal } from 'styled-components'

const colorFruitSalad = '#4D9D6B'
const colorSeaGreen = '#2A7F4A'

injectGlobal`
*,
*::before,
*::after {
    box-sizing: border-box;
}

img {
    max-width: 100%;
}

.link {
    color: ${colorFruitSalad};
    cursor: pointer;

    &:hover
        color: ${colorSeaGreen};
}
 

`
