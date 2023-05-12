const mysql = require('mysql')
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'forNode'
})

// db.query('SELECT 1', (err, result) => {
//   if (err) return console.log(err.message)
//   console.log(result)
// })

const query = 'select * from users'
db.query(query, (err, result) => {
  console.log(result)
})