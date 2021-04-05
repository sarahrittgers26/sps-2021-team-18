import axios from '../components/Api/Api';
import { ACTION } from './types';

// On sign in
export const signIn = (user) => ({
  type: ACTION.SIGN_IN,
  payload: user
});

// On sign out
export const signOut = () => ({
  type: ACTION.SIGN_OUT,
  payload: null
});

// On visibility change
export const changeVisibility = (change) => ({
  type: ACTION.CHANGE_VISIBILITY,
  payload: change
});

// On project selection
export const chooseProject = (project) => ({
  type: ACTION.CHOOSE_PROJECT,
  payload: project
});

// Update 
export const loadUsers = (username) => async (dispatch) => {
  if (username !== '') {
    // Load users from backend
    let url = `/get-users?username=${username}`;
    const response = await axios.get(url);
    const users = response.data;
    const activeUsers = [];
    const inactiveUsers = [];
    for (var i = 0; i < users.length; i++) {
      let current = users[i];
      let user = { name: current.name, username: current.username, 
	      email: current.email };
      if (current.isActive) {
        activeUsers.push(user);
      } else {
        inactiveUsers.push(user);
      }
    }
    dispatch({ type: ACTION.UPDATE_ACTIVE_USERS, payload: activeUsers });
    dispatch({ type: ACTION.UPDATE_INACTIVE_USERS, payload: inactiveUsers });
  }
}

// Load project data
export const loadProjects = (username) => async (dispatch) => {
  if (username !== '') {
    // Load projects from backend
    let url = `/load?username=${username}`;
    const response = await axios.get(url);
    const projects = response.data;
    const offlineProjects = [];
    const onlineProjects = [];
    for (var i = 0;i < projects.length; i++) {
      let current = projects[i]
      let project = { collaborator: current.partner, projectid: current.projectid,
	      title: current.title };
      if (current.bothActive) {
	onlineProjects.push(project);
      } else {
	offlineProjects.push(project);
      }
    }
    dispatch({ type: ACTION.UPDATE_ONLINE_PROJECTS, payload: onlineProjects });
    dispatch({ type: ACTION.UPDATE_OFFLINE_PROJECTS, payload: offlineProjects });
  }
}
