const API = "http://localhost:3333";
const USERS = [
  { name: "Daniel",  fullname: "Daniel Werner",  username: "daniel.werner",  email: "daniel.werner@email.com" },
  { name: "Felipe",  fullname: "Felipe Silva",   username: "felipe.silva",   email: "felipe.silva@email.com" },
  { name: "Filipi",  fullname: "Filipi Ghisleni",username: "filipi.ghisleni",email: "filipi.ghisleni@email.com" },
  { name: "Kevin",   fullname: "Kevin Felippe",  username: "kevin.felippe",  email: "kevin.felippe@email.com" },
  { name: "Lucas",   fullname: "Lucas Heck",     username: "lucas.heck",     email: "lucas.heck@email.com" },
  { name: "Luis",    fullname: "Luis André Pacheco",    username: "luis.pacheco",   email: "luis.pacheco@email.com" },
  { name: "Luis",    fullname: "Luis Antônio Pastório", username: "luis.pastorio",  email: "luis.pastorio@email.com" },
  { name: "Nicolas", fullname: "Nicolas Morsch", username: "nicolas.morsch", email: "nicolas.morsch@email.com" },
  { name: "Peterson",fullname: "Peterson Schroeder", username: "peterson.schroeder", email: "peterson.schroeder@email.com" },
  { name: "Tawa",    fullname: "Tawã Carvalho",  username: "tawa.carvalho",  email: "tawa.carvalho@email.com" },
  { name: "Victor",  fullname: "Victor Barreto", username: "victor.barreto", email: "victor.barreto@email.com" },
  { name: "Sofia",   fullname: "Sofia Schmidt",  username: "sofia.schmidt",  email: "sofia.schmidt@email.com" },
  { name: "Vitor",   fullname: "Vitor Limberger",username: "vitor.limberger",email: "vitor.limberger@email.com" }
];

for (const u of USERS) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...u, password: "passwd123" })
  });
  console.log(u.email, res.status);
}
