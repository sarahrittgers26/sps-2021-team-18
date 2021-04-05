import axios from '../components/Api/api';

import { AnyAction } from 'redux';

// On sign in
export const signIn = (user) => ({
  type: ACTION.SIGN_IN,
  payload: user
});


