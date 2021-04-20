import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import './Projects.css';
import ConnectedUsers from './ConnectedUsers.js';
import Searchbar from './Searchbar.js';
import Header from './Header.js';
import ProjectCard from './ProjectCard.js';
import ConnectionDialog from './ConnectionDialog.js';
import AlertDialog from './AlertDialog.js';
import About from './About.js';
import ProfileDialog from './ProfileDialog.js';
import { changeName, chooseProject, clearReducer, updateActive, signOut, 
	loadProjects, clearProject, changeAvatar, 
	changeVisibility, changePassword, selectCollab } from '../../actions';
import SocketSingleton from '../../middleware/socketMiddleware.js';
import { ACTION } from '../../actions/types.js';

const Projects = ({ history }) => {
  // Get user from store
  const user = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const { activeUsers, contacts, onlineProjects,
	  offlineProjects } = useSelector((state) => state.projectReducer);
  const [searchQuery, setSearchQuery] = useState("");
  const [openConnectionDialog, setOpenConnectionDialog] = useState(false);
  const [currentConnection, setCurrentConnection] = useState({});
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState(onlineProjects.concat(offlineProjects));
  const [alertWarning, setAlertWarning] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [connectionAlert, setConnectionAlert] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [fromProject, setFromProject] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [displayAbout, setDisplayAbout] = useState(false);

  let socket = SocketSingleton.getInstance();
  socket.onopen = () => {
    let mes = JSON.stringify({ id: user.username, type: ACTION.SIGN_IN,
      data: "" });
    socket.send(mes);
    let allPaneIDS = []
    allProjects.forEach((project) => {
      // Setup socket for each editor pane with specified project 
      let projectid = project.projectid;
      allPaneIDS.push(projectid);
    });

    allPaneIDS.forEach(paneID => {
      let messageDto = JSON.stringify({ id: paneID, 
	  type: ACTION.LOAD_INIT_PROJECTS, data: "" })
      socket.send(messageDto);
    });

  };

  socket.onmessage = (response) => {
    let msg = JSON.parse(response.data);
    switch (msg.type) {
      case ACTION.PING_USER:
        let info_arr = msg.data.split("=");
        let ping_type = info_arr[0];
        let collaboratorId = info_arr[1];
        let collaboratorName = info_arr[2];
        let collabAvatar = info_arr[3];
        if (ping_type === "cancel") {
          const updatedNotifications = notifications.filter((notification) => {
            return notification.collaboratorId === collaboratorId;
          })
          setNotifications(updatedNotifications);
        }
        
	else if (ping_type === "create") {
    setNotifications([...notifications,
		  { collaboratorName: collaboratorName,
		    collaborator: collaboratorId,
        projectid: "",
	      isNewProject: true,
		    projectTitle: "New Project",
		    type: ping_type,
		    proj: collaboratorId,
		    collaboratorAvatar: collabAvatar,
		  }]);
      
      } else {
        let projectid = info_arr[4];
        let html = "";
        let css = "";
        let js = "";
        for(var i = 0; i < onlineProjects.length; i++) {
          if (onlineProjects[i].projectid === projectid) {
            html = onlineProjects[i].html
            css = onlineProjects[i].css
            js = onlineProjects[i].js
            break;
          }
        }
        let avatar = "0";
              for(var j = 0; j < contacts.length; i++) {
        if (contacts[j].username === collaboratorId) {
          avatar = contacts[j].avatar
          break;
        }
        }
        let title = info_arr[5];
        let proj = { collaborator: collaboratorId, collaboratorName: collaboratorName,
          title: title, projectid: projectid, html: html, css: css, js: js,
        avatar: avatar }
              setNotifications([...notifications,
          { collaboratorName: collaboratorName,
            projectid: projectid,
            collaborator: collaboratorId,
            isNewProject: false,
            projectTitle: proj.title,
            type: ping_type,
            proj: proj,
            collaboratorAvatar: collabAvatar,
          }]);
      }
      break;
    case ACTION.COLLAB_ADD_PROJECT:
      loadProjects(user.username);
      break;

    default:
  }
  }
 
  window.onbeforeunload = () => {
    socket.onclose = () => {
    }
  }

	
  // Update active status if online
  useEffect(() => {
    if (!user.isVisible) {
      return;
    } else {
      const interval = setInterval(() => {
        dispatch(updateActive({ username: user.username, isVisible: user.isVisible, 
          isProjectsPage: true }));
      }, 2000);
      return () => { 
	    clearInterval(interval);
      }
    }
  }, [user.username, user.isVisible, dispatch]);

  // this displays the connection dialog for the user to confirm they want to send the invite
  const continueProject = (projectid, title, collaborator, collaboratorName, 
	  html, css, js) => {
    
    if (isOnline(collaborator)) {
      setFromProject(true);
      setOpenConnectionDialog(true);
      let avatar = "0";
      let isActive = true;
      for(var i = 0; i < contacts.length; i++) {
      if (contacts[i].username === collaborator) {
        avatar = contacts[i].avatar
        isActive = contacts[i].isActive
        break;
	}
      }
      setCurrentConnection({
        name: collaboratorName, 
        username: collaborator,
        avatar: avatar,
        isActive: isActive,
      });
      dispatch(selectCollab({ name: collaboratorName, username: collaborator,
	      avatar: avatar }));
      dispatch(chooseProject({ projectid: projectid, 
	      collaborator: collaborator, collaboratorName: collaboratorName, 
	      html: html, css: css, js: js, title: title, collaboratorAvatar: avatar }));
      
      setConnectionAlert(
        `This will send an invitation to ${collaboratorName} to continue working on ${title}`
        );

    } else {
      setOpenAlertDialog(true);
      setAlertWarning(
        `${collaboratorName} is currently offline. You can only edit 
	      this project when you are both online.`
      );
    }
  }

  // this displays the connection dialog for the user to confirm they want to send the invite
  const onActiveUserClick = (name, username, avatar) => {
    setFromProject(false);
    setOpenConnectionDialog(true);
    setCurrentConnection({
      name: name, 
      username: username,
      avatar: avatar,
      isActive: true
    });
    dispatch(selectCollab({ name: name, username: username, avatar: avatar }));
    setConnectionAlert(
      `This will CREATE a new project with ${name}.`
    );
  }

  // this is called when the user tries to connect with a recent user
  const onRecentUserClick = (collaborator, collaboratorName, isActive, avatar) => {
    if (isActive) {
      onActiveUserClick(collaboratorName, collaborator, avatar);
      return;
    }
    setOpenAlertDialog(true);
    setAlertWarning(
      `${collaboratorName} is currently offline. You can only CREATE new projects with ACTIVE users.`
    );
  }

  
  // when the user want to log out
  const handleLogout = () => {
    dispatch(signOut());
    dispatch(clearReducer());
    history.push('/');
  }

  // called when user clicks on Profile
  const displayProfile = () => {
    setOpenProfileDialog(true);
  }
  const downloadProject = (title, html, css, js) => {  
    let folderName = getFolderName(title);
    const zip = require('jszip')();
    let folder = zip.folder(folderName);

    // add the files to the folder
    folder.file("index.js", js);
    folder.file("style.css", css);
    folder.file("index.html", html);

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

  // check if the user is with given username is online
  const isOnline = (collaborator) => {
    for (let user of allUsers) {
      if (user.username === collaborator) {
        return user.isActive;
      }
    }
    return false;
  }

  // when the user clicks save after editing Profile
  const saveProfile = (name, password, isVisible, avatar) => {
    if (user.name !== name) {
      dispatch(changeName({ username: user.username, name: name }));
    }

    if (user.avatar !== avatar) {
      dispatch(changeAvatar({ username: user.username, avatar: avatar }));
    }
    
    if (user.isVisible !== isVisible) {
      dispatch(changeVisibility({ username: user.username, visibility: isVisible }));
    }
    
    if (password.length >= 8 && password.length <= 60) {
      dispatch(changePassword({ username: user.username, password: password }));
    }
    setOpenProfileDialog(false);
  }

  const closeConnectionDialog = (fromProject) => {
    setOpenConnectionDialog(false);
    if (fromProject) {
      dispatch(clearProject());
    }
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
        key={project.projectid}
        title={project.title}
        image={project.image}
        collaboratorName={project.collaboratorName}
        downloadProject={() => downloadProject(project.projectid, project.html, project.css, project.js)}
        continueProject={() => continueProject(
          project.projectid, project.title, project.collaborator, 
	  project.collaboratorName, project.html, project.css, project.js
        )}/>
    ));
    return projects;
  }


  // 
  const acceptCollaboration = (notification, callBack) => {
    const updated = notifications.filter(notif => {
      return notif !== notification
    })
    setNotifications(updated);
    callBack();
  }

  // accept when a user sends collaboration request
  const acceptCallBack = (not_type, info) => {
    if (not_type === "create") {
      let msg = JSON.stringify({ id: info, type: ACTION.REC_CREATE_PING, data: "yes" })
      socket.send(msg);
      dispatch(loadProjects(user.username))
    } else {
      let data = `yes-${user.avatar}`;
      let msg = JSON.stringify({ id: info.collaborator, type: ACTION.REC_CONTINUE_PING, 
	      data: data })
      socket.send(msg);
      dispatch(chooseProject({ projectid: info.projectid, 
	  collaborator: info.collaborator, collaboratorName: info.collaboratorName, 
	  html: info.html, css: info.css, js: info.js, title: info.title, collaboratorAvatar: info.avatar }));
      history.push("/editor");
    }
  }


  // decline when a user sends collaboration request
  const declineCallBack = (collabId, ping_type) => {
    if (ping_type === "create") {
      let msg = JSON.stringify({ id: collabId, type: ACTION.REC_CREATE_PING, data: "no" })
      socket.send(msg);
    } else {
      let msg = JSON.stringify({ id: collabId, type: ACTION.REC_CONTINUE_PING, data: "no" })
      socket.send(msg);
    }

  }

  const declineCollaboration = (notification, callBack) => {
    const updated = notifications.filter(notif => {
      return notif !== notification
    })
    setNotifications(updated);
    callBack();
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
    setAllUsers([]);
    setAllProjects([]);
    let allUsersReloaded = contacts.concat(activeUsers);
    let allProjectsReloaded = onlineProjects.concat(offlineProjects);
    // let allPaneIDS = []
    
    // allProjectsReloaded.forEach((project) => {
    //   // Setup socket for each editor pane with specified project 
    //   let projectid = project.projectid;
    //   allPaneIDS.push(projectid);
    // });

    // allPaneIDS.forEach(paneID => {
    //   let messageDto = JSON.stringify({ id: paneID, 
	  // type: ACTION.LOAD_INIT_PROJECTS, data: "" })
    //   socket.send(messageDto);
    // });

    setAllUsers(allUsersReloaded);
    setAllProjects(allProjectsReloaded);
  }, [contacts, onlineProjects, offlineProjects, activeUsers, socket]);


  useEffect(() => {
    let projects = allProjects.filter((project) => {
      return project.title.includes(searchQuery) || project.title.includes(searchQuery.toUpperCase());
    });

    // setDisplayedProjects([]);
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
        displayProfile={displayProfile}
        notifications={notifications}
        avatar={user.avatar}
        accept={acceptCollaboration}
        acceptCallBack={acceptCallBack}
        declineCallBack={declineCallBack}
        decline={declineCollaboration}
        history={history}
        isActive={user.isVisible}
        displayAbout={() => setDisplayAbout(true)}/>

      
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

          {!loadingProjects && displayedProjects.length > 0 && ( 
            <div className="Projects_recent">
              {getProjectComponents()}
            </div>
          )}    
        </div>

        <div className="Projects_sidebar">
          <ConnectedUsers 
            activeUsers={activeUsers}
            contacts={contacts}
            onActiveUserClick={onActiveUserClick}
            onRecentUserClick={onRecentUserClick}
            isVisible={user.isVisible}/>
        </div>   
      </div>
      
      {openConnectionDialog && (
        <ConnectionDialog
          collaboratorName={currentConnection.name}
          collaboratorId={currentConnection.username}
          isActive={user.isVisible}
          isOpen={openConnectionDialog}
          fromProject={fromProject}
          closeDialog={() => closeConnectionDialog(fromProject)}
          message={connectionAlert}
          socket={socket}
          history={history}
          notifications={notifications}/>
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
          currentOnlineStatus={user.isVisible}
          closeDialog={() => setOpenProfileDialog(false)}
          saveProfile={saveProfile}
          avatar={user.avatar}/>
      )}  

      {displayAbout && (
        <About 
          isOpen={displayAbout}
          closeDialog={() => setDisplayAbout(false)}
        />
      )}    
    </div>
  );
}
export default Projects;
