import { ACTION } from '../actions/types';

const initialState = {
  isSignedIn: false,
  username: '',
  email: '',
  name: '',
  isVisible: true,
  avatar: 0,
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
	  case ACTION.SIGN_IN:
      return { ...state, isSignedIn: true, username: action.payload.username, 
	      email: action.payload.email, name: action.payload.name, 
      		appearingOnline: action.payload.appearingOnline, avatar: action.payload.avatar };
    case ACTION.SIGN_OUT:
      return { ...state, isSignedIn: false, username: '', email: '', 
	      activeProject: '', appearingOnline: true, avatar: 0 };
    case ACTION.CHANGE_VISIBILITY:
      return { ...state, isVisible: action.payload };
    case ACTION.CHANGE_NAME:
      return { ...state, name: action.payload };
      case ACTION.CHANGE_AVATAR:
        return { ...state, avatar: action.payload };
    default:
      return state;
  }
}
