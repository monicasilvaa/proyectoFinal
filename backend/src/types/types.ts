export interface CreateClientRequestBody {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    birthday_date: Date;
}
 
 export interface LoginUserRequestBody {
    email: string;
    password: string;
 }
 
 export interface TokenData {
    userId: string;
    userRole: string;
 }