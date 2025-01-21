export interface Auth {
    token: string;
    usertype: string;
}

export interface SignInParams {
    username: string;
    password: string;
}

export interface ResetPasswordParams {
    email: string;
}
  