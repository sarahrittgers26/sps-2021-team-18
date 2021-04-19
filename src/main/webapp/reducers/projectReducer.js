import { ACTION } from '../actions/types';

const initialState = {
  activeProject: '',
  html: '',
  css: '',
  js: '',
  title: '',
  collaboratorId: '',
  collaboratorName: '',
  onlineProjects: [],
  offlineProjects: [],
  activeUsers: [],
  contacts: [],
  canEdit: false,
}

export const projectReducer = (state = initialState, action) => {
  /* Add socket text to project editor
  const concatToHtml = state.html.create.concat;
  const concatToCss = state.css.create.concat;
  const concatToJs = state.js.create.concat;
  const concatToTitle = state.title.create.concat;
  */
  switch (action.type) {
    case ACTION.CHOOSE_PROJECT:
      return { ...state, activeProject: action.payload.projectid, 
	      html: action.payload.html, css: action.payload.css,
      js: action.payload.js, collaboratorName: action.payload.collaboratorName,
      title: action.payload.title, collaboratorId: action.payload.collaborator };
    case ACTION.CLEAR_PROJECT:
      return { ...state, html: "", css: "", js: "", collaboratorName: "",
      title: "", activeProject: "", collaboratorId: "" };
    case ACTION.CHOOSE_USER:
      return { ...state, collaboratorId: action.payload };
    case ACTION.LOAD_INIT_PROJECTS:
      return { ...state, onlineProjects: action.payload.onlineProjects,
      offlineProjects: action.payload.offlineProjects };
    case ACTION.UPDATE_PROJECTS:
      return { ...state, onlineProjects: action.payload.onlineProjects,
      offlineProjects: action.payload.offlineProjects };
    case ACTION.UPDATE_USERS:
      return { ...state, contacts: action.payload.contacts,
	      activeUsers: action.payload.activeUsers };
    case ACTION.CAN_EDIT:
      return { ...state, canEdit: action.payload };
    case ACTION.REC_HTML:
      return { ...state, html: state.html.concat(action.payload) };
    case ACTION.REC_CSS:
      return { ...state, css: state.css.concat(action.payload) };
    case ACTION.REC_JS:
      return { ...state, js: state.js.concat(action.payload) };
    case ACTION.REC_TITLE:
      return { ...state, title: state.title.concat(action.payload) };
    case ACTION.CLEAR_REDUCER:
      return { ...state, activeProject: '', onlineProjects: [], title: '',
      offlineProjects: [], activeUsers: [], contacts: [], html: '',
      css: '', js: '', canEdit: false, collaboratorId: '', 
	      collaboratorName: '' };
    default:
      return state;
  }
};


