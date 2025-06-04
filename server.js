const express = require('express');
const session = require('express-session');
const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // 👈 Importante!

const app = express();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const isProduction = process.env.NODE_ENV === 'production';

// 🛡️ CORS: permite seu frontend acessar a API com cookies
const allowedOrigins = ["http://localhost:5500", "http://127.0.0.1:5500"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));


// 🛡️ Sessão: configurada para HTTPS e cross-site cookies
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: isProduction,                 // HTTPS no Heroku
    sameSite: isProduction ? 'none' : 'lax' // permite cross-origin no Heroku
  }
}));

app.use(express.json());
app.use(middlewares);

// 🧠 Carrega o conteúdo de db.json na sessão
function loadData() {
  const dbData = fs.readFileSync(path.join(__dirname, 'db.json'));
  return JSON.parse(dbData);
}

app.use((req, res, next) => {
  if (!req.session.db) {
    req.session.db = loadData();
  }
  next();
});

// ✅ Validação dos dados de usuário
function validateUserData(userData) {
  const allowedFields = ['name', 'age', 'email'];
  const extraFields = Object.keys(userData).filter(key => !allowedFields.includes(key));
  if (extraFields.length > 0) {
    return { isValid: false, message: `Campos extras não permitidos: ${extraFields.join(', ')}` };
  }
  if (typeof userData.name !== 'string' || typeof userData.email !== 'string' || typeof userData.age !== 'number') {
    return { isValid: false, message: 'Campos inválidos.' };
  }
  return { isValid: true };
}

// 🧩 Rotas personalizadas usando a sessão
app.use((req, res, next) => {
  if (req.method === 'POST' && req.url === '/users') {
    const newUser = req.body;
    const validation = validateUserData(newUser);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.message });
    }
    if (!req.session.db.users) {
      req.session.db.users = [];
    }
    newUser.id = String(req.session.db.users.length + 1);
    req.session.db.users.push(newUser);
    return res.status(201).json(newUser);
  }

  if (req.method === 'PUT' && req.url.startsWith('/users/')) {
    const userId = parseInt(req.url.split('/')[2]);
    const updatedData = req.body;
    const userIndex = req.session.db.users.findIndex(user => user.id == userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const validation = validateUserData(updatedData);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.message });
    }
    const updatedUser = { ...req.session.db.users[userIndex], ...updatedData };
    req.session.db.users[userIndex] = updatedUser;
    return res.status(200).json(updatedUser);
  }

  if (req.method === 'DELETE' && req.url.startsWith('/users/')) {
    const userId = parseInt(req.url.split('/')[2]);
    const userIndex = req.session.db.users.findIndex(user => user.id == userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    req.session.db.users.splice(userIndex, 1);
    return res.status(200).json({ message: 'Usuário removido com sucesso.' });
  }

  next();
});

// 🔎 Endpoints da sessão
app.get('/users', (req, res) => {
  res.json(req.session.db.users || []);
});

app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = req.session.db.users.find(u => u.id == userId);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }
  res.json(user);
});

// 🔄 JSON Server (mock API para outros recursos)
app.use('/api', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em https://api-node-test-6c4b0a5d4c87.herokuapp.com`);
});
