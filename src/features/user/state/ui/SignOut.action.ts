import { createAction } from 'typesafe-actions';

export const signOut = createAction('userAuth/ui/sign_out/SIGN_OUT_REQUEST');
export const signOutSuccess = createAction('userAuth/ui/sign_out/SIGN_OUT_SUCCESS');
export const signOutFailure = createAction(
  'userAuth/ui/sign_out/SIGN_OUT_FAILURE',
  resolve => (error: Error) => resolve(error)
);
