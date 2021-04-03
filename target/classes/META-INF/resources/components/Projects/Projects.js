import React from 'react'
import './Projects.css'
import Users from './Users.js'

const active = ["Mufaro Makiwa", "Cynthia Enofe", "Michael Lawes", "Sarah Rittgers"]
const inactive = ["Andreea Lovan", "Emmanuel Makiwa"]

function Projects() {
  return (
    <div className="Projects_container">

      <div className="Projects_content">

      </div>

      <div className="Projects_active">
        <Users 
          active={active}
          inactive={inactive}/>
      </div>
    </div>
  )
}

export default Projects
