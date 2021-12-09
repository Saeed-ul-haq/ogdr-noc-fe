import React from 'react'
import './styles.scss'


const Toolbar = ({leftToolbar,rightToolbar}) => {

  
  return (
    <div className="toolbar-container">
      <div className="toolbar-left-container">
      {leftToolbar}
      </div>
      <div className="toolbar-right-container">
       {rightToolbar}
      </div>
    </div>
  )
}

export default Toolbar
