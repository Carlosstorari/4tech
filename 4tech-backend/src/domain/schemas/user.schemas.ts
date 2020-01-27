import * as mongoose from 'mongoose';
import {Document} from 'mongoose';

//na hora de pegar do db
export interface User extends Document{ 
    readonly _id: mongoose.Schema.Types.ObjectId;
    readonly userLogin: string;
    readonly userName: string;
    readonly userPassword: string;
}
//na hora de criar(como vai escrever dentro do banco)
export const UserSchema = new mongoose.Schema({
    userLogin: String,
    userName: String,
    userPassword: String
});