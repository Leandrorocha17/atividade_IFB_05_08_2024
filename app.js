const express = require('express');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false})) 
app.use(bodyParser.json()) 
// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ifb'
});

// Connect
db.connect((err) => {
  if(err){
      throw err;
  }
  console.log('MySql Connected...');
});

app.get('/', (req, res) => {
  res.send(`
  <h1>Menu</h1>
  <ul>
    <li><a href="/getprof">Listar Prof</a></li>
    <li><a href="/deleteprof">Apagar Prof</a></li>
    <li><a href="/addprof">Adicionar Prof</a></li>
  </ul> 
  `);
});

// Insert aluno form
app.get('/addprof', (req, res) => {
  res.send(`
  <h1>Menu</h1>
  <ul>
    <li><a href="/getprof">Listar Prof</a></li>
    <li><a href="/deleteprof">Apagar Prof</a></li>
  </ul>
  <br>
    <form action="/addprof" method="post">
    <label>SIAPI:</label>
    <input type="number" name="siapi" required><br><br>
      <label>Nome:</label>
      <input type="text" name="nome" required><br><br>
      <label>Idade:</label>
      <input type="number" name="idade" required><br><br>
      <label>Materia:</label>
      <input type="text" name="materia" required><br><br>
      <input type="submit" value="Submit">
    </form>
  `);
});


app.get('/deleteprof', (req, res) => {
    res.send(`
    <h1>Menu</h1>
    <ul>
      <li><a href="/addprof">Adicionar prof</a></li>
      <li><a href="/getprof">Listar prof</a></li>
      </ul>
    <br>
      <form action="/deleteprof" method="post">
        <label>Siapi prof:</label>
        <input type="text" name="siapi" required><br><br>
       <br>
        <input type="submit" value="Submit">
      </form>
    `);
  });



  app.post('/deleteprof', (req, res) => {
    let query = db.query('DELETE FROM prof where siape=?',
   [req.body.siapi],
   (err, result) => {
       if(err) throw err;
       console.log(result);
       res.redirect('/getprof');
   });
 });
  

// Insert aluno
app.post('/addprof', (req, res) => {
   let query = db.query('INSERT INTO prof (siape, nome, idade, materia) Values (?,?,?,?)',
  [req.body.siapi,req.body.nome,req.body.idade,req.body.materia],
  (err, result) => {
      if(err) throw err;
      console.log(result);
      res.redirect('/getprof');
  });
});

// Select alunos
app.get('/getprof', (req, res) => {
  let sql = 'SELECT * FROM prof';
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send(`
      <h1>Menu</h1>
    <ul>
      <li><a href="/addprof">Adicionar Prof</a></li>
      <li><a href="/deleteprof">Apagar Prof</a></li>
    </ul>
    <br>
        <table>
          <tr>
            <th>SIAPE</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Materia</th>
          </tr>
          ${results.map(prof => `<tr><td>${prof.siape}</td><td>${prof.nome}</td><td>${prof.idade}</td><td>${prof.materia}</td></tr>`).join('')}
        </table>
      `);
  });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});