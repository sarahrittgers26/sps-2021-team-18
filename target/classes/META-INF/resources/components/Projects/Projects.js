import React, {useEffect, useState, useRef} from 'react'
import './Projects.css'
import ConnectedUsers from './ConnectedUsers.js'
import Searchbar from './Searchbar.js'
import Header from './Header.js'
import ProjectCard from './ProjectCard.js'
import ConnectionDialog from './ConnectionDialog.js'


const active = [
  {name: "Mufaro Emmanuel Manue Makiwa", id: 0},
  {name: "Cynthia Enofe", id: 1},
  {name: "Michael Lawes", id: 2},
  {name: "Sarah Rittgers", id: 3},
]

const inactive = [
  {name: "Emmanuel Makiwawa", id: 0},
  {name: "Andreea Lovan", id: 1}
]

const allProjects = [
  {
    projectId: 0,
    title: "Simple HTML",
    collaborator: "Mufaro Makiwa"
  },
  {
    projectId: 1,
    title: "Basic CSS",
    collaborator: "Michael Lawes"
  },
  {
    projectId: 2,
    title: "Basic JS",
    collaborator: "Cynthia Enofe"
  },
  {
    projectId: 3,
    title: "Basic Coding",
    collaborator: "Sarah Rittgers"
  },
  {
    projectId: 4,
    title: "Basic basic hahaha",
    collaborator: "Andreea Lovan"
  },
  {
    projectId: 5,
    title: "Another basic HTML",
    collaborator: "Emmanuel Makiwa"
  },
  {
    projectId: 6,
    title: "Another hahaha",
    collaborator: "Manue Makiwa"
  }
]

function Projects() {

  const [searchQuery, setSearchQuery] = useState("");
  const [openConnectionDialog, setOpenConnectionDialog] = useState(false);
  const [currentConnection, setCurrentConnection] = useState("");
  const [displayedProjects, setDisplayedProjects] = useState("");
  const projectsRef = useRef();

  const onActiveUserClick = (id) => {
    alert("Active user clicked: " + id);
  }
  
  const onInactiveUserClick = (id) => {
    alert("Inactive user clicked: " + id);
  }

  const handleLogout = () => {
    alert("Handle logout");
  }

  const displaySettings = () => {
    alert("Display settings dialog")
  }

  const downloadProject = (projectId) => {
    alert("Downloading project: " + projectId);
  }

  const closeDialog = () => {
    setOpenConnectionDialog(false);
    
  }

  const continueProject = (projectId, collaborator) => {
    setOpenConnectionDialog(true);
    setCurrentConnection(collaborator);
  }

  useEffect(() => {
    const projects = allProjects.filter((project) => {
      return project.title.includes(searchQuery);
    }).map((project) => (
      <ProjectCard
        key={`Project_${project.projectId}`}
        title={project.title}
        collaborator={project.collaborator}
        downloadProject={() => downloadProject(project.projectId)}
        continueProject={() => continueProject(project.projectId, project.collaborator)}/>
    ));
    setDisplayedProjects(projects);

    // disable flickering behavious on window resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      document.body.classList.add("resize-animation-stopper");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
      }, 400);
  });

  }, [openConnectionDialog, searchQuery]);


  return (
    <div className="Projects_container" ref={projectsRef}>

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
          {displayedProjects}
          </div>      
        </div>

        <div className="Projects_sidebar">
          <ConnectedUsers 
            active={active}
            inactive={inactive}
            onActiveUserClick={onActiveUserClick}
            onInactiveUserClick={onInactiveUserClick}/>

      </div>
      
      </div>
      
      <ConnectionDialog
        collaborator={currentConnection}
        isOpen={openConnectionDialog}
        closeDialog={closeDialog}/>
          
    </div>
  )
}

export default Projects
