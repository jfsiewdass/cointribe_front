export interface GenericResponse<Type>{
    status?:string,
    code?:number,
    data:Type,
    message:string
}