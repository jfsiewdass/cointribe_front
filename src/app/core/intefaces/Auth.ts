export interface LoginRequest{
    email: string;
    password?: string;
}
export interface UserData{
    email:string,
    wallet: AuthWallet
}
export interface AuthWallet {
    address: string,
    balance: number,
    coin: string
}
export interface RefreshTokenData{
    Token:string,
    RefreshToken:string
}

export interface LogoutData{
}
export interface RefreshTokenBody{
    Token:string,
    RefreshToken:string
}

export interface UserData{
    FirstName:string,
    MiddleName:string,
    Surname:string,
    LastName:string,
    Rol:number
}

export interface DecodedToken{
    appt:string,
    aud:string,
    exp:number,
    iss:number,
    jti:number,
    nbf:number
    perm:string
}