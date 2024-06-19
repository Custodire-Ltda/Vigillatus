const express = require('express');
const session = require('express-session');
const app = express();
const port = '3131';
const fs = require('fs');

//Sequelize modules import
const Setor = require('./models/Setor');
const Cargo = require('./models/Cargo');
const Gestor = require('./models/Gestor');
const Colaborador = require('./models/Colaborador');
const EPI = require('./models/EPI');
const SetorEpi = require('./models/SetorEpi');
const Camera = require('./models/Camera');
const Ocorrencia = require('./models/Ocorrencia');
/* const Norma = require('./models/Norma'); */
const OcorrenciaNorma = require('./models/OcorrenciaNorma');

//Router imports
const cadastrar = require('./controller/signUpController');
const home = require('./controller/homeController');
const addColab = require('./controller/addColabController');
const gestorEdit = require('./controller/gestorController');
const colabEdit = require('./controller/colabController');
const cameras = require('./controller/camController');
const historico = require('./controller/reportController');
const dashboard = require('./controller/graphController');

/////{ CONFIGURAÇÕES }//////////////////////////////////////////////////////////////////////////////////

//Session config
app.use(session({
    secret: 'vigillatus',
    resave: false,
    saveUninitialized: true
}));

//Static files config
app.use(express.static('public'));

//Body-parser config
const bodyParser = require('body-parser');
const Norma = require('./models/Norma');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

//Configurando EJS como view engine
app.set('view engine', 'ejs');

/////{ ROTAS }//////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`Server on: http://localhost:${port}`);
});



//Rota para o a tela de login
app.get('/', (req, res) => {

    res.render('index.ejs', { error: null });
    Setor;
    Cargo;
    Norma;
    EPI;
    OcorrenciaNorma;
    Ocorrencia;
    Camera;
    SetorEpi;
    Colaborador;
    Gestor;


    /* Inserindo dados inicialmente */
    try {

        async function initialInsert(){

            /* Listando todas as cartas na tabela Cargo */
            const existCargo = await Cargo.findAll();

            /* Verificando se a tabela está vazia para então inserir os dados */
            if (existCargo.length === 0) {
                await Cargo.bulkCreate([
                    { nome: 'Tec. Segurança no trabalho', nivel: 1 },
                    { nome: 'Gestor', nivel: 1 },
                    { nome: 'Mecânico', nivel: 2 },
                    { nome: 'Soldador', nivel: 2 }
                ]);

                console.log('Cargos inseridos');
            } else {
                console.log('Cargos não inseridos');
            }


            const existSetores = await Setor.findAll();
            if(existSetores.length === 0){
                await Setor.bulkCreate([
                    {descricao: 'Oficina'},
                    {descricao: 'Caldeira'},
                    {descricao: 'Carregamento'}
                ]);

                console.log('Setores inseridos');
            }else{
                console.log('Setores não inseridos');
            };

            const existEpi = await EPI.findAll();
            if(existEpi.length === 0){
                await EPI.bulkCreate([
                    {descricao:'Capacete de segurança'},
                    {descricao:'Luvas de segurança'},
                    {descricao:'Óculos de segurança'},
                    {descricao:'Bota de segurança'}
                ]);

                console.log('Epis inseridos');
            }else{
                console.log('Epis não inseridos');
            };

            const existNorma = await Norma.findAll();
            if(existNorma.length === 0){
                await Norma.bulkCreate([
                    {
                        descricao:'NR 6: Equipamento de Proteção Individual (EPI)',
                        textoNotificacao:'Estabelece a obrigatoriedade do fornecimento gratuito de EPI adequado ao risco, em perfeito estado de conservação e funcionamento, aos trabalhadores.'
                    }
                ]);

                console.log('Epis inseridos');
            }else{
                console.log('Epis não inseridos');
            };

            const existCamera = await Camera.findAll();
            if(existCamera.length === 0){
                await Camera.bulkCreate([
                    {
                        descricao:"Camera 1",
                        idSetor:1
                    }
                ]);
            }
        }

        

        initialInsert();
        
    } catch {
        console.log('FODEU DE VEZ')
    }

});

//Fazendo verificação básica para o usuário exevutar o login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    // Buscando usuário através do email
    const identifyUser = await Gestor.findOne({ where: { email } });

    // Verifica existência do usuário
    if (!identifyUser) {
        console.log('Usuário não encontrado');
        res.render('index.ejs', { error: 'Usuário não encontrado' });
    } else {

        // Verifica se a senha do usuário é igual a do banco
        if (senha == identifyUser.senha) {

            // Verifica se o cargo do usuário é de um nível adequado para entrar
            const cargo = await Cargo.findByPk(identifyUser.idCargo);
            if (cargo && cargo.nivel) {

                // altera o nome da pasta do gestor para seu ID
                const gestorPastaAntiga = './public/uploads/' + identifyUser.nome;
                const gestorPastaNova = './public/uploads/' + identifyUser.id;

                if (fs.existsSync(gestorPastaAntiga)) {
                    fs.renameSync(gestorPastaAntiga, gestorPastaNova);
                }

                // Passando os dados do usuário na sessão
                req.session.user = identifyUser;
                res.redirect('/home');
            } else {
                res.render('index.ejs', { error: 'Usuário não autorizado' });
            }
        } else {
            res.render('index.ejs', { error: 'Senha incorreta' });
        }
    }
    
});


// Rota para fazer logout
app.get('/logout', (req, res) => {
    // Limpar a sessão do usuário
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {

            res.redirect('/');
        }
    });
});

//Rota para tela de cadastramento
app.use('/cadastrar', cadastrar);

//Rota para a tela home (parte interna da aplicação)
app.use('/home', home);

//Rota para a tela de cadastro de colaboradores
app.use('/home/addColab', addColab);

//Rota para a tela de edição de perfil do *gestor
app.use('/home/perfilGestor/edit', gestorEdit);

//Rota para a tela de câmeras
app.use('/home/cameras', cameras);

app.use('/home/dashboard', dashboard);

app.use('/home/historico', historico)