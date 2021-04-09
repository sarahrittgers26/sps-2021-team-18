import axios from '../components/Api/Api';
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
                collaborator: current.partner,
                projectid: current.projectid,
                title: current.title,
                html: current.html,
                css: current.css,
                js: current.js
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
                email: current.email,
                isActive: current.isActive
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

// On visibility change
export const changeVisibility = (change) => {
    return {
        type: ACTION.CHANGE_VISIBILITY,
        payload: change
    }
};

// On project selection
export const chooseProject = (project) => {
    return {
        type: ACTION.CHOOSE_PROJECT,
        payload: project
    }
};

// Update active users
export const updateActiveUsers = (userList) => {
    return {
        type: ACTION.UPDATE_ACTIVE_USERS,
        payload: userList
    }
};

// Update inactive users
export const updateInactiveUsers = (userList) => {
    return {
        type: ACTION.UPDATE_INACTIVE_USERS,
        payload: userList
    }
};

// Update online projects
export const updateOnlineProjects = (projectList) => {
    return {
        type: ACTION.UPDATE_ONLINE_PROJECTS,
        payload: projectList
    }
};

// Update offOnline projects
export const updateOfflineProjects = (projectList) => {
    return {
        type: ACTION.UPDATE_OFFLINE_PROJECTS,
        payload: projectList
    }
};

// On name change
export const changeName = (change) => async(dispatch) => {
    const username = change.username;
    const name = change.name;
    let url = `/change-name?username=${username}&name=${name}`;
    const response = await axios.get(url);
    dispatch({
        type: ACTION.CHANGE_NAME,
        payload: name
    })
};

// On password change
export const changePassword = (change) => async(dispatch) => {
    const username = change.username;
    const password = change.password;
    let url = `/change-pass?username=${username}&password=${password}`;
    const response = await axios.get(url);
    dispatch({
        type: ACTION.CHANGE_PASSWORD,
        payload: password
    })
};

// Load users that are active and inactive 
export const loadUsers = (username) => async(dispatch) => {
    if (username !== '') {
        // Load users from backend
        let url = `/get-users?username=${username}`;
        const response = await axios.get(url);
        dispatch({ type: ACTION.UPDATE_CONTACTS, payload: userSelector(true, response.data) });
        dispatch({ type: ACTION.UPDATE_ACTIVE_USERS, payload: userSelector(false, response.data) });
    }
};

// Load projects that are online or offline
export const loadProjects = (username) => async(dispatch) => {
    if (username !== '') {
        // Load projects from backend
        let url = `/load?username=${username}`;
        const response = await axios.get(url);
        dispatch({ type: ACTION.UPDATE_ONLINE_PROJECTS, payload: projectSelector(true, response.data) });
        dispatch({ type: ACTION.UPDATE_OFFLINE_PROJECTS, payload: projectSelector(false, response.data) });
    }
};