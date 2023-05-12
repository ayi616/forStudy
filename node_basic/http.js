const http = require('http')
const server = http.createServer()
server.on('request', (req, res) => {
  console.log(req.url, 'url')
  console.log(req.method, 'method')

  // 设置请求头，解决中文乱码问题
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end('请求成功')
})
server.listen(80, () => {
  console.log('listening')
})