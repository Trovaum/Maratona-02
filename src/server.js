const express = require('express')
const routes = require("./routes")
const server = express()
const path = require("path")

// usando template engine com ejs
server.set("view engine", "ejs")

//mudar a localizaçõa da paasta views
server.set('views', path.join(__dirname, 'views'))

//habilitar arquivos statics
server.use(express.static("public"))

// usar req.body
server.use(express.urlencoded({ extended: true}))

//rotas
server.use(routes)

server.listen(3000, () => console.log('Rodando...'))
