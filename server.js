// server.js
const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

// CORS – ajuste a origem do seu front se quiser restringir
server.use(cors({ origin: true, credentials: true }));
server.use(middlewares);

// (Opcional) Regras por recurso.
// Ex.: só logados leem users (640). Troque para 600 se quiser “só o dono”.
const rules = auth.rewriter({
  users: 640,
  // posts: 644,
  // cities: 664,
});
server.db = router.db;
server.use(rules);
server.use(auth);

server.use(router);

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`✅ JSON Server Auth rodando na porta ${PORT}`);
});
