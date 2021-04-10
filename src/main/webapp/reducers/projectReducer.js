import { ACTION } from '../actions/types';

const initialState = {
  activeProject: '',
  activeUser: '',
  onlineProjects: [],
  offlineProjects: [],
  activeUsers: [],
  contacts: []
}

export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.CHOOSE_PROJECT:
      return { ...state, activeProject: action.payload };
    case ACTION.CHOOSE_USER:
      return { ...state, activeUser: action.payload };
    case ACTION.UPDATE_ONLINE_PROJECTS:
      return { ...state, onlineProjects: action.payload };
    case ACTION.UPDATE_OFFLINE_PROJECTS:
      return { ...state, offlineProjects: action.payload };
    case ACTION.UPDATE_ACTIVE_USERS:
      return { ...state, activeUsers: action.payload };
    case ACTION.UPDATE_CONTACTS:
      return { ...state, contacts: action.payload };
    case ACTION.CLEAR_PROJECTS:
      return { ...state, activeProject: '', onlineProjects: [],
      offlineProjects: [], activeUsers: [], contacts: [] };
    default:
      return state;
  }
}
