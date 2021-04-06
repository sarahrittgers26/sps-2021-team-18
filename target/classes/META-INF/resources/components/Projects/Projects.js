import React, {useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import './Projects.css';
import ConnectedUsers from './ConnectedUsers.js';
import Searchbar from './Searchbar.js';
import Header from './Header.js';
import ProjectCard from './ProjectCard.js';
import ConnectionDialog from './ConnectionDialog.js';
import AlertDialog from './AlertDialog.js';
import ProfileDialog from './ProfileDialog.js'

const active = [
  {name: "Mufaro Emmanuel Manue Makiwa", id: 0},
  {name: "Cynthia Enofe", id: 1},
  {name: "Michael Lawes", id: 2},
  {name: "Sarah Rittgers", id: 3},
  {name: "Mufaro Makiwa", id: 4},
];

const inactive = [
  {name: "Emmanuel Makiwa", id: 5},
  {name: "Andreea Lovan", id: 6}
];

const allProjects = [
  {
    projectId: 0,
    title: "Simple HTML",
    collaborator: "Mufaro Makiwa",
    collaboratorId: 4,
    html: "<h1>This is my name</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was just saved\")"
  },
  {
    projectId: 1,
    title: "Basic CSS",
    collaborator: "Michael Lawes",
    collaboratorId: 2,
    html: "<h1>I just love how this is taking shape</h1>",
    css: "h1 {color: grey}",
    js: "console.log(\"I was just saved, damn\")"
  },
  {
    projectId: 2,
    title: "Basic JS",
    collaborator: "Cynthia Enofe",
    collaboratorId: 1,
    html: "<h1>I dont like this project at all</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was didnt want to be saved\")"
  },
  {
    projectId: 3,
    title: "Basic Coding",
    collaborator: "Sarah Rittgers",
    collaboratorId: 3,
    html: "<h1>I am tired of being used for testing</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was just saved\")"
  },
  {
    projectId: 4,
    title: "Basic basic hahaha",
    collaborator: "Andreea Lovan",
    collaboratorId: 6,
    html: "<h1>Oh yeah he got me</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was just saved\")"
  },
  {
    projectId: 5,
    title: "Another basic HTML",
    collaborator: "Emmanuel Makiwa",
    collaboratorId: 5,
    html: "<h1>I am being used for testing</h1>",
    css: "h1 {color: red}",
    js: "console.log(\"I was just saved\")"
  }
];

function Projects() {

  const [searchQuery, setSearchQuery] = useState("");
  const [openConnectionDialog, setOpenConnectionDialog] = useState(false);
  const [currentConnection, setCurrentConnection] = useState("");
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [alertWarning, setAlertWarning] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  const onActiveUserClick = (name, id) => {
    alert("Active user clicked: " + id + " " + name);
  }
  
  const onInactiveUserClick = (collaborator) => {
    setOpenAlertDialog(true);
    setAlertWarning(
      `${collaborator} is currently offline. You can only create new projects with online users.`
      )
    
  }

  // when the user want to log out
  const handleLogout = () => {
    alert("Handle logout");
  }

  // called when user clicks on Profile
  const displayProfile = () => {
    setOpenProfileDialog(true);
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

  // save project as a zip file on download
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

  // check if the user is with id given is online
  const isOnline = (collaboratorId) => {
    console.log(activeUsers);
    console.log(inactiveUsers);
    for (let user of active) {
      if (user.id === collaboratorId) {
        return true;
      }
    }
    return false;
  }

  // called user clicks on continue button
  const continueProject = (projectId, collaborator, collaboratorId) => {
    if (isOnline(collaboratorId)) {
      setOpenConnectionDialog(true);
      setCurrentConnection(collaborator);

    } else {
      setOpenAlertDialog(true);
      setAlertWarning(
        `${collaborator} is currently offline. You can only edit this project when you are both online.`
        )
    } 
  }

  // called when a user clicks on the create new button
  const createNew = () => {
    alert("Creating new project");
  }

  // when the user clicks save after editing Profile
  const saveProfile = (name, email, onlineStatus) => {
    alert("To handle save");
    setOpenProfileDialog(false);
  }

  useEffect(() => {
    // disable flickering behavious on window resize
    let resizeTimer;
    window.addEventListener("resize", () => {
      document.body.classList.add("resize-animation-stopper");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
      }, 400);
    });
  }, [])


  useEffect(() => {
    // set state for active and inactive users with dummy users
    setActiveUsers(active);
    setInactiveUsers(inactive);
  }, []);


  useEffect(() => {
    const projects = allProjects.filter((project) => {
      return project.title.includes(searchQuery);
    }).map((project) => (
      <ProjectCard
        key={`Project_${project.projectId}`}
        title={project.title}
        collaborator={project.collaborator}
        downloadProject={() => downloadProject(project.projectId)}
        continueProject={() => continueProject(project.projectId, project.collaborator, project.collaboratorId)}/>
    ));

    setDisplayedProjects(projects);
  }, [searchQuery]);


  return (
    <div className="Projects_container">

      <Header 
        name="Mufaro Makiwa"
        email="mufaroemakiwa@gmail.com"
        handleLogout={handleLogout}
        displayProfile={displayProfile}/>

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
          <div className="Projects_create_new card" onClick={createNew}>
            <div className="Projects_addIcon_container">
              <AddCircleOutlineIcon 
                style={{ fontSize: 50, color: "gray" }}/>
            </div>
    
            <span className="Projects_create_span">  
              Create new project
            </span>
          </div>

          <ConnectedUsers 
            active={activeUsers}
            inactive={inactiveUsers}
            onActiveUserClick={onActiveUserClick}
            onInactiveUserClick={onInactiveUserClick}/>
        </div>   
      </div>
      
      {openConnectionDialog && (
        <ConnectionDialog
          collaborator={currentConnection}
          isOpen={openConnectionDialog}
          closeDialog={() => setOpenConnectionDialog(false)}/>)}
        
      {openAlertDialog && (
        <AlertDialog 
          isOpen={openAlertDialog}
          closeDialog={() => setOpenAlertDialog(false)}
          message={alertWarning}/>)} 

      {openProfileDialog && (
        <ProfileDialog 
          isOpen={openProfileDialog}
          name="Mufaro Makiwa"  // this depends on the users credentials
          username="mufaromakiwa"
          currentOnlineStatus={true} // this will depend on the users previous setting
          closeDialog={() => setOpenProfileDialog(false)}
          saveProfile={saveProfile}/>)}
    </div>
  );
}

export default Projects
