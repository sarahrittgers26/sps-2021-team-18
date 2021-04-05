import React, {useEffect, useState } from 'react';
import './Projects.css';
import ConnectedUsers from './ConnectedUsers.js';
import Searchbar from './Searchbar.js';
import Header from './Header.js';
import ProjectCard from './ProjectCard.js';
import ConnectionDialog from './ConnectionDialog.js';
import { saveAs } from 'file-saver';


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
    collaborator: "Mufaro Makiwa",
    html: "<h1>This is my name</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was just saved\")"
  },
  {
    projectId: 1,
    title: "Basic CSS",
    collaborator: "Michael Lawes",
    html: "<h1>I just love how this is taking shape</h1>",
    css: "h1 {color: grey}",
    js: "console.log(\"I was just saved, damn\")"
  },
  {
    projectId: 2,
    title: "Basic JS",
    collaborator: "Cynthia Enofe",
    html: "<h1>I dont like this project at all</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was didnt want to be saved\")"
  },
  {
    projectId: 3,
    title: "Basic Coding",
    collaborator: "Sarah Rittgers",
    html: "<h1>I am tired of being used for testing</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was just saved\")"
  },
  {
    projectId: 4,
    title: "Basic basic hahaha",
    collaborator: "Andreea Lovan",
    html: "<h1>Oh yeah he got me</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was just saved\")"
  },
  {
    projectId: 5,
    title: "Another basic HTML",
    collaborator: "Emmanuel Makiwa",
    html: "<h1>I am being used for testing</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was just saved\")"
  }
]

function Projects() {

  const [searchQuery, setSearchQuery] = useState("");
  const [openConnectionDialog, setOpenConnectionDialog] = useState(false);
  const [currentConnection, setCurrentConnection] = useState("");
  const [displayedProjects, setDisplayedProjects] = useState("");


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

  // given a project id, get the project object with that id
  const getProject = projectId => {
    let selectedProject;
    for (let project of allProjects) {
      if (project.projectId === projectId) {
        selectedProject = project;
        break;
      }
    }
    return selectedProject;
  }

  const downloadProject = (projectId) => {
    // get the project
    
    let selectedProject = getProject(projectId);
    let folderName = getFolderName(selectedProject.title);
    const zip = require('jszip')();
    let folder = zip.folder(folderName);

    // add the files to the folder
    folder.file("index.js", selectedProject.js);
    folder.file("index.css", selectedProject.css);
    folder.file("index.html", selectedProject.html);

    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        saveAs(content, `${folderName}.zip`);
    });
  }

  // format the folder name to get rid of white spaces and add underscores
  const getFolderName = (title) => {
    let split = title.split(/[\s,]+/);
    split = split.filter(item => {
      return item !== "";
    }).map(word => word.toLowerCase()).join("_")
    return split;
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

        <span className="Projects_label">
          Recent Projects
        </span>

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
