import React, {useEffect, useState} from 'react'
import './Projects.css'
import ConnectedUsers from './ConnectedUsers.js'
import Searchbar from './Searchbar.js'
import Header from './Header.js'
import ProjectCard from './ProjectCard.js'


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

  const [searchQuery, setSearchQuery] = useState("");
  const onActiveUserClick = (id) => {
    console.log("Active user clicked: " + id);
  }
  
  
  const onInactiveUserClick = (id) => {
    console.log("Inactive user clicked: " + id);
  }

  const handleLogout = () => {
    alert("Handle logout");
  }

  const displaySettings =() => {
    alert("Display settings dialog")
  }

  useEffect(() => {

  });


  return (
    <div className="Projects_container">

      <Header 
        name="Mufaro Makiwa"
        email="mufaroemakiwa@gmail.com"
        handleLogout={handleLogout}
        displaySettings={displaySettings}/>

      <div className="Projects_main">
        <div className="Projects_content">
          <Searchbar
            query={searchQuery}
            onChange={setSearchQuery}/>

          <div className="dummies">
            <ProjectCard
              title="First task"
              collaborator="Mufaro Makiwa"/>

            {/* <ProjectCard
              title="Second task"
              collaborator="Emmanuel Makiwa"/> */}
          </div>
          
        </div>

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