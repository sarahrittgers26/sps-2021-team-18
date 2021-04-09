import React, {useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import './Projects.css';
import ConnectedUsers from './ConnectedUsers.js';
import Searchbar from './Searchbar.js';
import Header from './Header.js';
import ProjectCard from './ProjectCard.js';
import ConnectionDialog from './ConnectionDialog.js';
import AlertDialog from './AlertDialog.js';
import ProfileDialog from './ProfileDialog.js'
import axios from '../Api/Api';
import { loadProjects, loadUsers, signIn, changeName, changeVisibility, changePassword } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';

const active = [
  {name: "Mufaro Emmanuel Manue Makiwa", id: 0, online: true},
  {name: "Cynthia Enofe", id: 1, online: true},
  {name: "Michael Lawes", id: 2, online: true},
  {name: "Sarah Rittgers", id: 3, online: true},
  {name: "Mufaro Makiwa", id: 4, online: true},
];

const recent = [
  {name: "Dwayne Johnson", id: 7, online: true},
  {name: "Emmanuel Makiwa", id: 5, online: false},
  {name: "Andreea Lovan", id: 6, online: false}
];

const dummyProjects = [
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

  // Get user from store
  const user = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  // const { activeUsers, inactiveUsers, onlineProjects, offlineProjects } = useSelector((state) => state.chat);

  const [searchQuery, setSearchQuery] = useState("");
  const [openConnectionDialog, setOpenConnectionDialog] = useState(false);
  const [currentConnection, setCurrentConnection] = useState({});
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [alertWarning, setAlertWarning] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setRecentUsers] = useState([]);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [connectionAlert, setConnectionAlert] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);


  // this displays the connection dialog for the user to confirm they want to send the invite
  const onActiveUserClick = (name, id) => {
    setOpenConnectionDialog(true);
    setCurrentConnection({
      name: name, 
      userId: id
    });
    setConnectionAlert(
      `This will send an invitation to ${name} to collaborate on a new project.`
    );
  }


  // this displays the connection dialog for the user to confirm they want to send the invite
  const continueProject = (projectId, projectTitle, collaborator, collaboratorId) => {
    if (isOnline(collaboratorId)) {
      setOpenConnectionDialog(true);
      setCurrentConnection({
        name: collaborator, 
        userId: collaboratorId
      });
      setConnectionAlert(
        `This will send an invitation to ${collaborator} to continue working on the project, ${projectTitle}`
        );

    } else {
      setOpenAlertDialog(true);
      setAlertWarning(
        `${collaborator} is currently offline. You can only edit this project when you are both online.`
      );
    } 
  }
  
  // this is called when the user tries to connect with a recent user
  const onRecentUserClick = (collaborator, collaboratorId, online) => {
    if (online) {
      onActiveUserClick(collaborator, collaboratorId);
      return;
    }
    setOpenAlertDialog(true);
    setAlertWarning(
      `${collaborator} is currently offline. You can only collaborate on new projects with active users.`
    );
  }

  const sendInvite = (collaboratorId) => {
    console.log(collaboratorId);
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
    for (let user of active) {
      if (user.id === collaboratorId) {
        return true;
      }
    }
    return false;
  }

  // when the user clicks save after editing Profile
  const saveProfile = (name, password, onlineStatus) => {
    if (user.name !== name) {
      dispatch(changeName({ username: user.username, name: name }));
    }
    
    if (user.appearingOnline !== onlineStatus) {
      dispatch(changeVisibility(onlineStatus));
    }
    
    if (password.length >= 8 && password.length <= 60) {
      dispatch(changePassword({ username: user.username, password: password }));
    }
    setOpenProfileDialog(false);
  }


  const closeConnectionDialog = () => {
    setOpenConnectionDialog(false);
    setConnectionAlert("");
    setCurrentConnection({});
  }

  const closeAlertDialog = () => {
    setAlertWarning("");
    setOpenAlertDialog(false);
  }

  const getProjectComponents = () => {
    let projects = displayedProjects.map((project) => (
      <ProjectCard
        key={`Project_${project.projectId}`}
        title={project.title}
        collaborator={project.collaborator}
        downloadProject={() => downloadProject(project.projectId)}
        continueProject={() => continueProject(
          project.projectId, project.title, project.collaborator, project.collaboratorId
        )}/>
    ));
    return projects;
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
  }, []);


  useEffect(() => {
    // set state for active and recent users with dummy users
    setActiveUsers(active);
    setRecentUsers(recent);
    setAllProjects(JSON.parse(JSON.stringify(dummyProjects)));
  }, []);


  useEffect(() => {
    const projects = allProjects.filter((project) => {
      return project.title.includes(searchQuery);
    });
    setDisplayedProjects(projects);
    
    return () => {
      if (loadingProjects) {
        setLoadingProjects(false);
      }
    }
  }, [searchQuery, allProjects, loadingProjects]);


  return (
    <div className="Projects_container">
      <Header 
        name={user.name}
        email={user.email}
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

        {!loadingProjects && allProjects.length === 0 && ( 
          <div className="card Projects_no_result">
            <span className="no_result_summary">
              No projects
            </span>
            <span className="no_result_message">
              You have not collaborated on any projects with anyone. Please select any active user
              to start collaborating on your first project.
            </span>
          </div>
        )}


        {!loadingProjects && allProjects.length !== 0 && displayedProjects.length === 0 && (
          <div className="card Projects_no_result">
            <span className="no_result_summary">
              No results found
            </span>
            <span className="no_result_message">
              You do not have any project that matches the given name. 
            </span>
          </div>
        )}

        {!loadingProjects && ( 
          <div className="Projects_recent">
            {getProjectComponents()}
          </div>
        )}    
        </div>

        <div className="Projects_sidebar">
          <ConnectedUsers 
            active={activeUsers}
            recent={inactiveUsers}
            onActiveUserClick={onActiveUserClick}
            onRecentUserClick={onRecentUserClick}/>
        </div>   
      </div>
      
      {openConnectionDialog && (
        <ConnectionDialog
          collaborator={currentConnection.name}
          collaboratorId={currentConnection.userId}
          isOpen={openConnectionDialog}
          closeDialog={closeConnectionDialog}
          message={connectionAlert}
          sendInvite={sendInvite}/>
      )}
        
      {openAlertDialog && (
        <AlertDialog 
          isOpen={openAlertDialog}
          closeDialog={closeAlertDialog}
          message={alertWarning}/>
      )} 

      {openProfileDialog && (
        <ProfileDialog 
          isOpen={openProfileDialog}
          name={user.name} 
          currentOnlineStatus={user.appearingOnline}
          closeDialog={() => setOpenProfileDialog(false)}
          saveProfile={saveProfile}/>
      )}
    </div>
  );
}

export default Projects
