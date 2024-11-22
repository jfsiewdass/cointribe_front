import { FormControl } from "@angular/forms";

export interface LoginForm {
    email?: FormControl<string>;
    password?: FormControl<string>;
}

export interface RegisterForm {
    firstName?:FormControl<string>;
    lastName?:FormControl<string>;
    email?: FormControl<string>;
    password?: FormControl<string>;
    confirmPassword?: FormControl<string>;
}