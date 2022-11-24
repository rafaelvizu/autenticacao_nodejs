import express from 'express';
import exphbs from 'express-handlebars';
import 'dotenv/config';
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
            password: hashedPassword,
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

// login user
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: 'Todos os campos são obrigatórios',
        });
    } else {
        // check if user exists
        const user = await Users.findOne({email});

        if (!user) {
            res.status(404).json({msg: 'Usuário não cadastrado'});
        } else {
            if (await bcrypt.compare(password, user.password)) {
                try {
                    // secret é usado para deixar o token mais seguro
                    const SECRET = process.env.SECRET;
                    const token = jwt.sign({
                        id: user._id,
                    }, SECRET);
                    res.status(200).json({msg: 'Usuário logado com sucesso', token});
                }
                catch {
                    res.status(500).json({msg: 'Erro interno do servidor'});
                }

            } else {
                res.status(422).json({msg: 'Senha incorreta'});
            }
        }
    }
});

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({msg: 'Token não encontrado'});
    } else {
        const SECRET = process.env.SECRET;

        try {
            jwt.verify(token, SECRET);  
            req.user_id = jwt.decode(token).id;
            next();
        }
        catch (err) {
            res.status(403).json({msg: 'Token inválido'});
        }
    }
}

// Private route
app.get('/user/:id', checkToken, async (req, res) => {
    const _id = req.params.id;
    const user_id = req.user_id;
    
    // check if users exists
    if (_id == user_id) {
        await Users.findById(_id, '-password')
        .then(user => {
            user ? res.status(200).json(user) :
                res.status(404).json({msg: 'Usuário não cadastrado'});
        })
        .catch(err => {
            _id.length !== 24 ? 
                res.status(400).json({msg: 'Usuário não cadastrado'}) :
                res.status(500).json({msg: 'Erro interno do servidor'});
            
            console.error(err);
        });
    } else { 
        res.status(403).json({msg: 'Acesso negado'});
    }

});

app.get('/', (req, res) => {
    res.json({msg: 'Hello World'});
});

 
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
