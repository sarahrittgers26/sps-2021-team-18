import { projectReducer } from './projectReducer';
import { userReducer } from './userReducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  projectReducer,
  userReducer
});

export default rootReducer;
