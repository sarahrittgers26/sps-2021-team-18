import React from 'react'
import './Projects.css'
import ConnectedUsers from './ConnectedUsers.js'


const active = [
  {name: "Mufaro Emmanuel Manue Makiwa", id: 0},
  {name: "Cynthia Enofe", id: 1},
  {name: "Michael Lawes", id: 2},
  {name: "Sarah Rittgers", id: 3},
]

const inactive = [
  {name: "Emmanuel Makiwa", id: 0},
  {name: "Andreea Lovan", id: 1}
]

function Projects() {

  const onActiveUserClick = (id) => {
    console.log("Active user clicked: " + id);
  }
  
  
  const onInactiveUserClick = (id) => {
    console.log("Inactive user clicked: " + id);
  }


  return (
    <div className="Projects_container">

      <div className="Projects_content"></div>

      <div className="Projects_active">
        <ConnectedUsers 
          active={active}
          inactive={inactive}
          onActiveUserClick={onActiveUserClick}
          onInactiveUserClick={onInactiveUserClick}/>
      </div>
    </div>
  )
}

export default Projects
