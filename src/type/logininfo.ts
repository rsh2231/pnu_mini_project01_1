import { Role } from "./registerinfo";

type LoginStatus= 'logged-out' | 'logged-in';


export type Logininfo = {
    isLogin : LoginStatus;
    role? : Role;
    nickname? : string;
    logintype?: string;
    username?: string;
    enabled?: boolean;
}

