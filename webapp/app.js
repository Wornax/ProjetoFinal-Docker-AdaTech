const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 80;

const db = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'mydb',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');

  // Inserindo alguns dados na tabela "users" durante a inicialização
  const insertQuery = `
    INSERT INTO users (name) VALUES 
    ('Luiz Gabriel'),
    ('Rodrigo'),
    ('Fernando'),
    ('Joniel')
  `;

  db.query(insertQuery, (err, result) => {
    if (err) throw err;
    console.log('Data inserted into "users" table');
  });
});

// Criação da tabela "users" no banco de dados (só para fins ilustrativos)
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )
`, (err) => {
  if (err) throw err;
  console.log('Table "users" created or already exists');
});

app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) throw err;

    // Renderiza uma página HTML com os dados da tabela "users"
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lista de Usuários</title>
        </head>
        <body>
          <h1>Lista de Usuários</h1>
          <ul>
            ${result.map(user => `<li>${user.name}</li>`).join('')}
          </ul>
        </body>
      </html>
    `;

    res.send(htmlResponse);
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
