import React from 'react'

import './index.sass'

const Paragraph = ({ children, ...rest }) => (
  <p className="descriptions" {...rest}>
    {children}
  </p>
)

export default Paragraph
