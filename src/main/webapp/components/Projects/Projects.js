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
    alert("Active user clicked: " + id);
  }
  
  
  const onInactiveUserClick = (id) => {
    alert("Inactive user clicked: " + id);
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

        <span className="Projects_label">Recent Projects</span>

        <div className="Projects_recent">
          <ProjectCard
              title="1"
              collaborator="Mufaro Makiwa"/>

            <ProjectCard
              title="2"
              collaborator="Mufaro Makiwa"/>

            <ProjectCard
              title="3"
              collaborator="Mufaro Makiwa"/>

            <ProjectCard
              title="4"
              collaborator="Mufaro Makiwa"/>

            <ProjectCard
              title="5"
              collaborator="Mufaro Makiwa"/>

            <ProjectCard
              title="6"
              collaborator="Mufaro Makiwa"/>

            <ProjectCard
              title="7"
              collaborator="Mufaro Makiwa"/>
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
