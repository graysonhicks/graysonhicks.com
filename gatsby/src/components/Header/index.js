import React from 'react'
import headshot from '../../images/headshot.jpg'

const Header = () => (
  <div className="row header">
    <div className="col-sm-2 col-xs-5">
      <div className="headshot-container">
        <img className="headshot" src={headshot} alt="" />
      </div>
    </div>
    <div className="col-sm-10 col-xs-7">
      <div className="name-container">
        <div className="name">grayson hicks</div>
      </div>
    </div>
  </div>
)

export default Header
