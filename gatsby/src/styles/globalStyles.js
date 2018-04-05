import { injectGlobal } from 'styled-components'

const colorFruitSalad = '#4D9D6B'
const colorSeaGreen = '#2A7F4A'

injectGlobal`
*,
*::before,
*::after {
    box-sizing: border-box;
}

@keyframes fade-in {
    from {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

body {
    padding: 15px;
    animation: fade-in 2s ease-in-out;
    opacity: 1;
    overflow-x: hidden;
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


@media screen and (max-width: 991px) {
    body {
        padding-top: 0px;
        padding-left: 0px;
        padding-right: 0px;
    }
}
 

`
