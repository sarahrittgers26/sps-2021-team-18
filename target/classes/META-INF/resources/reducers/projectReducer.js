import { ACTION } from '../actions/types';

const initialState = {
  activeProject: '',
  onlineProjects: [],
  offlineProjects: [],
  activeUsers: [],
  inactiveUsers: []
}

export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.CHOOSE_PROJECT:
      return { ...state, activeProject: action.payload };
    case ACTION.UPDATE_ONLINE_PROJECTS:
      return { ...state, onlineProjects: action.payload };
    case ACTION.UPDATE_OFFLINE_PROJECTS:
      return { ...state, offlineProjects: action.payload };
    case ACTION.UPDATE_ACTIVE_USERS:
      return { ...state, activeUsers: action.payload };
    case ACTION.UPDATE_INACTIVE_USERS:
      return { ...state, inactiveUsers: action.payload };
    default:
      return state;
  }
}
