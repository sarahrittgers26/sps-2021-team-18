import { ACTION } from '../actions/types';

const initialState = {
  isSignedIn: false,
  username: '',
  email: '',
  name: '',
  isVisible: true,
  avatar: "0",
  fromLogin: true
}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
	  case ACTION.SIGN_IN:
      return { ...state, isSignedIn: true, username: action.payload.username, 
	      email: action.payload.email, name: action.payload.name, 
	      avatar: action.payload.avatar, isVisible: action.payload.isVisible };
    case ACTION.SIGN_OUT:
      return { ...state, isSignedIn: false, username: '', email: '', 
	      activeProject: '',  avatar: "0" };
    case ACTION.CHANGE_VISIBILITY:
      return { ...state, isVisible: action.payload };
    case ACTION.UPDATE_LOCATION:
      return { ...state, fromLogin: action.payload };
    case ACTION.CHANGE_NAME:
      return { ...state, name: action.payload };
      case ACTION.CHANGE_AVATAR:
        return { ...state, avatar: action.payload };
    default:
      return state;
  }
}
