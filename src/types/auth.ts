export interface Auth {
    token: string;
    usertype: string;
}

export interface SignInParams {
    username: string;
    password: string;
}

export interface UpdatePasswordParams {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
}

export interface ResetPasswordParams {
    email: string;
}

export interface User {
    email: string;
    first_name: string;
    last_name: string;
    phone_no?: string;
    password?:string;
    terms?:boolean
}
  