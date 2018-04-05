import React from 'react'
const Paragraph = ({ children, ...rest }) => (
  <p className="descriptions" {...rest}>
    {children}
  </p>
)

export default Paragraph
