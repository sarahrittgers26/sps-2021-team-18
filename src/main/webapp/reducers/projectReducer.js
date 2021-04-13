import { ACTION } from '../actions/types';

const initialState = {
  activeProject: '',
  html: '',
  css: '',
  js: '',
  title: '',
  activeCollaborator: '',
  activeCollaboratorName: '',
  onlineProjects: [],
  offlineProjects: [],
  activeUsers: [],
  contacts: [],
  canEdit: false,
}

export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.CHOOSE_PROJECT:
      return { ...state, activeProject: action.payload.projectid, 
	      html: action.payload.html, css: action.payload.css,
      js: action.payload.js, activeCollaboratorName: action.payload.collaboratorName,
      title: action.payload.title, activeCollaborator: action.payload.collaborator };
    case ACTION.CLEAR_PROJECT:
      return { ...state, html: "", css: "", js: "", activeCollaboratorName: "",
      title: "", activeProject: "", activeCollaborator: "" };
    case ACTION.CHOOSE_USER:
      return { ...state, activeCollaborator: action.payload };
    case ACTION.UPDATE_PROJECTS:
      return { ...state, onlineProjects: action.payload.onlineProjects,
      offlineProjects: action.payload.offlineProjects };
    case ACTION.UPDATE_USERS:
      return { ...state, contacts: action.payload.contacts,
	      activeUsers: action.payload.activeUsers };
    case ACTION.CAN_EDIT:
      return { ...state, canEdit: action.payload };
    case ACTION.CLEAR_REDUCER:
      return { ...state, activeProject: '', onlineProjects: [], title: '',
      offlineProjects: [], activeUsers: [], contacts: [], html: '',
      css: '', js: '', canEdit: false, activeCollaborator: '', 
	      activeCollaboratorName: '' };
    default:
      return state;
  }
}
