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

const dummyProjects = [
  {
    projectId: 0,
    title: "Simple HTML",
    collaborator: "Mufaro Makiwa"
  },
  {
    projectId: 1,
    title: "Basic CSS",
    collaborator: "Mufaro Makiwa"
  },
  {
    projectId: 2,
    title: "Basic JS",
    collaborator: "Mufaro Makiwa"
  },
  {
    projectId: 3,
    title: "Basic Coding",
    collaborator: "Mufaro Makiwa"
  },
  {
    projectId: 4,
    title: "Basic basic hahaha",
    collaborator: "Mufaro Makiwa"
  },
  {
    projectId: 5,
    title: "Another basic HTML",
    collaborator: "Mufaro Makiwa"
  },
  {
    projectId: 6,
    title: "Another hahaha",
    collaborator: "Mufaro Makiwa"
  }
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

  const downloadProject = (projectId) => {
    alert("Downloading project: " + projectId);
  }

  const continueProject = (projectId) => {
    alert("Continuing project: " + projectId);
  }

  const projects = dummyProjects.map((project) => (
    <ProjectCard
      key={`Project_${project.projectId}`}
      title={project.title}
      collaborator={project.collaborator}
      downloadProject={() => downloadProject(project.projectId)}
      continueProject={() => continueProject(project.projectId)}/>
  ));

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
          {projects}
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
