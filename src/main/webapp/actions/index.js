import axios from '../components/Api/Api';
import SocketSingleton from '../middleware/socketMiddleware';
import { ACTION } from './types';

// Return either online or offline projects
const projectSelector = (selector, projects) => {
    const selection = [];
    for (var i = 0; i < projects.length; i++) {
        let current = projects[i]
            // selector is true/false for online/offline projects
            // if selector is true then only add online projects otherwise add offline
        if (current.bothActive === selector) {
            let project = {
                collaborator: current.collaborator,
		        collaboratorName: current.collaboratorName,
                projectid: current.projectid,
                title: current.title,
                html: current.html,
                css: current.css,
                js: current.js,
                collaboratorAvatar: current.collaboratorAvatar,
                image: current.image,
            };
            selection.push(project);
        }
    }
    return selection;
};

// Return either active or inactive users
const userSelector = (wantContact, users) => {
    const selection = [];
    for (var i = 0; i < users.length; i++) {
        
        let current = users[i]
            // selector is true/false for online/offline projects
            // if selector is true then only add online projects otherwise add offline
        if (current.isContact === wantContact) {
            let user = {
                username: current.username,
                name: current.name,
                isActive: current.isActive,
                avatar: current.avatar,
            };
            selection.push(user);
        }
    }
    return selection;
};

// On sign in
export const signIn = (user) => {
    return {
        type: ACTION.SIGN_IN,
        payload: user
    }
};

// On sign out
export const signOut = () => ({
    type: ACTION.SIGN_OUT,
    payload: null
});

// Clears state on sign out
export const clearReducer = () => ({
  type: ACTION.CLEAR_REDUCER,
  payload: null
});


// On project selection
export const chooseProject = (project) => {
    return {
        type: ACTION.CHOOSE_PROJECT,
        payload: project
    }
};

export const selectCollab = (collab) => {
    return {
        type: ACTION.SELECT_COLLAB,
        payload: collab
    }
};


// Function to handle saving project to database
export const handleSave = (proj) => async(dispatch) => {
  const newHtml = encodeURIComponent(proj.html);
  const newCss = encodeURIComponent(proj.css);
  const newJs = encodeURIComponent(proj.js);
  const newTitle = encodeURIComponent(proj.title);
  const projectid = proj.projectid;
  const image = proj.image;
  let htmlUrl = `/save-html?projectid=${projectid}&html=${newHtml}`;
  let cssUrl = `/save-css?projectid=${projectid}&css=${newCss}`;
  let jsUrl = `/save-js?projectid=${projectid}&js=${newJs}`;
  let titleUrl = `/update-title?projectid=${projectid}&title=${newTitle}`;
  let imageUrl = `/save-image?projectid=${projectid}&image=${image}`;
  await axios.get(htmlUrl);
  await axios.get(cssUrl);
  await axios.get(jsUrl);
  await axios.get(titleUrl);
  await axios.get(imageUrl);
}

// On project deselection
export const clearProject = () => {
    return {
        type: ACTION.CLEAR_PROJECT,
        payload: null
    }
};

// On user selection
export const chooseUser = (username) => {
    return {
        type: ACTION.CHOOSE_USER,
        payload: username
    }
};

// Update whether user can move to Editor page
export const updateCanEdit = (canEdit) => {
  return {
    type: ACTION.CAN_EDIT,
    payload: canEdit,
  }
}

// Update online status
export const updateActive = (pageInfo) => async(dispatch) => {
  const username = pageInfo.username;
  const isVisible = pageInfo.isVisible;
  const isProjectsPage = pageInfo.isProjectsPage;
  if (isVisible) {
    let url = `/update-active?username=${username}`;
    await axios.get(url);
  }
  
  if (isProjectsPage) {
    dispatch(loadProjects(username));
    dispatch(loadUsers(username));
  }
};

// On name change
export const changeName = (change) => async(dispatch) => {
    const username = change.username;
    const name = change.name;
    let url = `/change-name?username=${username}&name=${name}`;
    await axios.get(url);
    dispatch({
        type: ACTION.CHANGE_NAME,
        payload: name
    })
};

// On avatar change
export const changeAvatar = (change) => async(dispatch) => {
    const username = change.username;
    const avatar = change.avatar;
    let url = `/change-avatar?username=${username}&avatar=${avatar}`;
    await axios.get(url);
    dispatch({
        type: ACTION.CHANGE_AVATAR,
        payload: avatar
    })
};

// On password change
export const changePassword = (change) => async(dispatch) => {
    const username = change.username;
    const password = change.password;
    let url = `/change-pass?username=${username}&password=${password}`;
    await axios.get(url);
    dispatch({
        type: ACTION.CHANGE_PASSWORD,
        payload: password
    })
};

// On visibility change
export const changeVisibility = (visInfo) => async(dispatch) => {
    const username = visInfo.username;
    const vis = visInfo.visibility;
    let url = `/change-vis?username=${username}&visibility=${vis}`;
    await axios.get(url);
    dispatch({
        type: ACTION.CHANGE_VISIBILITY,
        payload: vis
    })
};

export const updateTitle = (title) => {
    return {
        type: ACTION.UPDATE_TITLE,
        payload: title
    }
};

// Create project with user
export const createProject = (details) => async(dispatch) => {
  const username = details.username;
  const partner = details.collaborator;
  const title = details.title;
  let url = `/create?username=${username}&partner=${partner}&title=${title}`;
  const response = await axios.post(url);
  let projectid = response.data;
  const socket = SocketSingleton.getInstance();
  let messageDto = JSON.stringify({ id: projectid, 
	type: ACTION.LOAD_INIT_PROJECTS, data: "" })
  socket.send(messageDto);
  let collabMesg = JSON.stringify({ id: partner, 
	type: ACTION.COLLAB_ADD_PROJECT, data: projectid })
  socket.send(collabMesg);
  dispatch(loadProjects(username));
};

// Load users that are active and inactive 
export const loadUsers = (username) => async(dispatch) => {
    if (username !== '') {
        // Load users from backend
        let url = `/get-users?username=${username}`;
        const response = await axios.get(url);
        dispatch({ 
            type: ACTION.UPDATE_USERS, 
            payload: {
                contacts: userSelector(true, response.data),
                activeUsers: userSelector(false, response.data)
            }
        });
    }
};

// Load projects that are online or offline
export const loadProjects = (username) => async(dispatch) => {
    if (username !== '') {
        // Load projects from backend
        let url = `/load?username=${username}`;
        const response = await axios.get(url);
        dispatch({ 
		type: ACTION.UPDATE_PROJECTS, 
		payload: { 
			onlineProjects: projectSelector(true, response.data), 
			offlineProjects: projectSelector(false, response.data) 
		}
	});
    }
};

// Load projects that are online or offline
export const loadInitialProjects = (username) => async(dispatch) => {
    if (username !== '') {
        // Load projects from backend
        let url = `/load?username=${username}`;
        const response = await axios.get(url);
        dispatch({ 
		type: ACTION.LOAD_INIT_PROJECTS, 
		payload: { 
			onlineProjects: projectSelector(true, response.data), 
			offlineProjects: projectSelector(false, response.data) 
		}
	});
    }
};
