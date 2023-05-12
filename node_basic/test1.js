const fs = require('fs')
const path = require('path')
// fs.readFile('./text.txt', 'utf8', function (err, dataStr) {
//   console.log(err, 'err')
//   console.log(dataStr, 'dataStr')
// })
// fs.writeFile('./text.txt', 'writeFile', function (err) {
//   console.log(err, 'err')
//   if (err) {
//     return console.log(err, 'writeErr')
//   } else {
//     fs.readFile('./text.txt', 'utf8', function (err, dataStr) {
//       if (err) {
//         console.log(err, 'readErr')
//       } else {
//         console.log(dataStr, 'readFileSucc')
//       }
//     })
//   }
// })

// console.log(__dirname, 'dirname')
console.log(__filename, 'filename')
const filename = __filename

const name = path.basename(filename, '.js')
console.log(name, 'name')