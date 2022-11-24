import express from 'express';
import exphbs from 'express-handlebars';
import dotenv from 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from './models/users.js';


const app = express();
const hbs = exphbs.create({
    partialsDir: ['./views/partials'],
});
const PORT = process.env.PORT


app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.static('./public'));

// Register user
app.post('/auth/register', async (req, res) => {
    const {name, email, password, confirmPassword} = req.body;

    // validacoes

    if (!name || !email || !password || !confirmPassword) {
        res.status(400).json({
            message: 'Todos os campos são obrigatórios',
       });
    } else if (password !== confirmPassword) {
        res.status(400).json({
            message: 'As senhas não conferem',
        });
    } else if (await Users.findOne({email})) {
        res.status(400).json({
            message: 'Usuário já cadastrado',
        });
    } else {
        const salt = await bcrypt.genSalt(12); // usado para add caracteres a mais, assim dificultando a quebra da senha

        const hashedPassword = await bcrypt.hash(password, salt);


        await new Users ({
            name,
            email,
            password,
        })
        .save()
        .then(() => {
            res.status(200).json({
                message: 'Usuário cadastrado com sucesso',
            });
        }).catch(err => {
            console.error(err);
            res.status(500).json({msg: 'Erro interno do servidor'});
        });

    }
});

app.get('/', (req, res) => {
    res.render('home');
});

 
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
