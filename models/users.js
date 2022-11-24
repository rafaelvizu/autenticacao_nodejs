import db from '../db.js';


const usersSchema = new db.Schema({
     name: String,
     email: String,
     password: String
});
const Users = db.model('Users', usersSchema);


export default Users;
