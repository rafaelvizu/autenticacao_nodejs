import db from '../db.js';


const usersSchema = new db.Schema({
     name: String,
     email: String,
     password: String
});
const Pessoa = db.model('Pessoa', usersSchema);


export default Pessoa;
