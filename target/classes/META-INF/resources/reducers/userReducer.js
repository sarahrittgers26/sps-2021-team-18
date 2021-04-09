import { ACTION } from '../actions/types';

const initialState = {
  isSignedIn: false,
  username: '',
  email: '',
  name: '',
  appearingOnline: true,
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
	  case ACTION.SIGN_IN:
      return { ...state, isSignedIn: true, username: action.payload.username, 
	      email: action.payload.email, name: action.payload.name };
    case ACTION.SIGN_OUT:
      return { ...state, isSignedIn: false, username: '', email: '', 
	      activeProject: '', appearingOnline: true };
    case ACTION.CHANGE_VISIBILITY:
      return { ...state, appearingOnline: action.payload };
    case ACTION.CHANGE_NAME:
      return { ...state, name: action.payload };
    default:
      return state;
  }
}
