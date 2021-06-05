import { createAction } from 'typesafe-actions';

export const changeEmail = createAction(
  'userAuth/ui/sign_in/CHANGE_EMAIL',
  resolve => (email: string) => resolve(email)
);
export const changeCode = createAction(
  'userAuth/ui/sign_in/CHANGE_CODE',
  resolve => (code: string) => resolve(code)
);
export const sendCode = createAction('userAuth/ui/sign_in/SEND_CODE');
export const sendCodeSuccess = createAction(
  'userAuth/ui/sign_in/SEND_CODE_SUCCESS'
);
export const sendCodeFailure = createAction(
  'userAuth/ui/sign_in/SEND_CODE_FAILURE',
  resolve => (error: Error) => resolve(error)
);
export const verifyCode = createAction('userAuth/ui/sign_in/VERIFY_CODE');
export const verifyCodeSuccess = createAction(
  'userAuth/ui/sign_in/VERIFY_CODE_SUCCESS'
);
export const verifyCodeFailure = createAction(
  'userAuth/ui/sign_in/VERIFY_CODE_FAILURE',
  resolve => (error: Error) => resolve(error)
);
export const finishAuth = createAction('userAuth/ui/sign_in/FINISH_AUTH');
