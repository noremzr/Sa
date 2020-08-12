var mysql      = require('mysql');
var express = require('express');
var bodyParser = require('body-parser')
var app = express() ;
const fs = require('fs');
app.use(bodyParser.urlencoded({
  extended: false
}));
 
// parse application/json
app.use(bodyParser.json())
var db = mysql.createConnection({
  host     : 'bibliotecam.crtaqlq0b9p4.us-east-1.rds.amazonaws.com',
  user     : 'sa',
  password : 'sa123456',
  database : 'Biblioteca'
});
app.use(express.json())
app.listen(1208,'0.0.0.0')
console.log('Iniciou')
app.use(express.static(__dirname+'/'));
app.use(express.static(__dirname+'/css'));
app.use(express.static(__dirname+'/js'));

app.get("/cadastroLeitor",(req,res)=>{
  if (usuarioLogado){
  res.sendFile(__dirname+'/CadastroLeitor.html');
}
else{
  res.sendFile(__dirname+'/login.html');
}
})

app.get("/index",(req,res)=>{
  if (usuarioLogado){
    res.sendFile(__dirname+'/index.html');
  }
  else{
    res.sendFile(__dirname+'/login.html');
  }
})

app.get("/cadastroLivro",(req,res)=>{
  if (usuarioLogado){
    res.sendFile(__dirname+'/CadastroLivro.html');
  }
  else{
    res.sendFile(__dirname+'/login.html');
  }
})


app.get("/login",(req,res)=>{
  if (usuarioLogado){
    res.sendFile(__dirname+'/index.html');
  }else{
  res.sendFile(__dirname+'/login.html');
}
})

app.get("/deslogar",(req,res)=>{
  usuarioLogado = false
  res.sendFile(__dirname+'/login.html');
})

app.get("/emprestimo",(req,res)=>{
  if (usuarioLogado){
  res.sendFile(__dirname+'/Emprestimo.html');
  }
  else{
    res.sendFile(__dirname+'/login.html');
  }
})

app.get("/reserva",(req,res)=>{
  if (usuarioLogado){
  res.sendFile(__dirname+'/Reserva.html');
  }
  else{
    res.sendFile(__dirname+'/login.html');
  }
})

app.get("/CadastrarFuncionario",(req,res)=>{
  if (usuarioLogado){
  res.sendFile(__dirname+'/CadastrarFuncionario.html');
  }
  else{
    res.sendFile(__dirname+'/login.html');
  }
})

app.get("/estatistica",(req,res)=>{
  if (usuarioLogado){
  res.sendFile(__dirname+'/Estatistica.html');
  }
  else{
    res.sendFile(__dirname+'/login.html');
  }
})

app.get('/consulta/:nome?', function (req, res) {
  var sql = ` SELECT `
  sql += " codLeitor, "
  sql += " nome, "
  sql += " dataNascimento, "
  sql += " genero, "
  sql += " cpf ,"
  sql += " telefone "
  sql += " FROM tleitors "
  if (req.params.nome != '0'){
  sql += ` WHERE nome like '%${req.params.nome}%' `
}
  sql += " LIMIT 100 "
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
  res.end()
}
)
}
)

app.post('/cadastroLeitor', function (req, res) {
  var sql
  if (req.body.codLeitor == 0){
  sql = "INSERT INTO "
  sql += " tleitors " 
  sql += " (nome, "
  sql += " cpf, "
  sql += " dataNascimento, "
  sql += " genero, "
  sql += " telefone "
  sql += " ) "
  sql += " VALUES ("
  sql += ` '${req.body.nome}', `
  sql += ` '${req.body.cpf}', `
  sql += ` '${req.body.dataNascimento}', `
  sql += ` '${req.body.genero}', `
  sql += ` '${req.body.telefone}' `
  sql += " )"
}
  else{
    sql = " UPDATE "
    sql += " tleitors "
    sql += " set "
    sql += ` nome = "${req.body.nome}", `
    sql += ` cpf = "${req.body.cpf}", `
    sql += ` dataNascimento = "${req.body.dataNascimento}", `
    sql += ` genero = "${req.body.genero}", `
    sql += ` telefone = "${req.body.telefone}" `
    sql += ` WHERE `
    sql += ` codLeitor  = ${req.body.codLeitor} `
}
db.query(sql)
res.end();
})

app.get('/consultaLivro/:titulo?', function (req, res) {
  var sql = ` SELECT `
  sql += " codLivro, "
  sql += " titulo, "
  sql += " autor, "
  sql += " editora, "
  sql += " generos ,"
  sql += " sinopse, "
  sql += " CASE WHEN situacao = 'D' THEN 'Disponível' "
  sql += " WHEN situacao = 'E' THEN 'Emprestado' "
  sql += " ELSE 'Reservado' END AS situacao "
  sql += " FROM tlivros "
  if (req.params.titulo != '0'){
  sql += ` WHERE titulo like '%${req.params.titulo}%' `
}
  sql += " LIMIT 100 "
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
  res.end()
}
)
}
)

app.post('/deleteLeitor', function (req, res) {
  var sql = " DELETE "
  sql += " FROM "
  sql += " tleitors "
  sql += " WHERE "
  sql += ` codLeitor = ${req.body.codLeitor} `
  db.query(sql)
  res.end();
})

app.post('/cadastroLivro', function (req, res) {
  var sql
  if (req.body.codLivro == 0){
  sql = "INSERT INTO "
  sql += " tlivros " 
  sql += " (titulo, "
  sql += " autor, "
  sql += " editora, "
  sql += " sinopse, "
  sql += " generos, "
  sql += " situacao "
  sql += " ) "
  sql += " VALUES ("
  sql += ` '${req.body.titulo}', `
  sql += ` '${req.body.autor}', `
  sql += ` '${req.body.editora}', `
  sql += ` '${req.body.sinopse}', `
  sql += ` '${req.body.generos}', `
  sql += ` 'D' `
  sql += " )"
}
  else{
    sql = " UPDATE "
    sql += " tlivros "
    sql += " set "
    sql += ` titulo = "${req.body.titulo}", `
    sql += ` autor = "${req.body.autor}", `
    sql += ` editora = "${req.body.editora}", `
    sql += ` sinopse = "${req.body.sinopse}", `
    sql += ` generos = "${req.body.generos}" `
    sql += ` WHERE `
    sql += ` codLivro  = ${req.body.codLivro} `
}
db.query(sql)
res.end();
})

app.post('/deleteLivro', function (req, res) {
  var sql = " DELETE "
  sql += " FROM "
  sql += " tlivros "
  sql += " WHERE "
  sql += ` codLivro = ${req.body.codLivro} `
  db.query(sql)
  res.end();
})

var usuarioLogado = false

app.get('/verificaUsuario/:nome', function (req, res) {
  var sql = ` SELECT `
  sql += " nome "
  sql += " FROM  tloginfuncionario "
  sql += ` WHERE nome = '${req.params.nome}' `
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
  res.end()
}
)
}
)

app.get('/verificaSenha/:nome/:senha', function (req, res) {
  var sql = ` SELECT `
  sql += " * "
  sql += " FROM  tloginfuncionario "
  sql += ` WHERE nome = '${req.params.nome}' `
  sql += ` AND senha = '${req.params.senha}' `
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
    for (i in result){
      usuarioLogado = true
    }
  res.end()
}
)
}
)

app.get('/consultaLivroEmprestimo/:titulo', function (req, res) {
  var sql = ` SELECT `
  sql += " codLivro, "
  sql += " titulo, "
  sql += " CASE WHEN situacao = 'D' THEN 'Disponível' "
  sql += " WHEN situacao = 'R' THEN 'Reservado' "
  sql += " ELSE  'Emprestado' END AS situacao "
  sql += " FROM tlivros "
  if (req.params.titulo != '0'){
  sql += ` WHERE titulo like '%${req.params.titulo}%' `
  sql += ` OR codLivro like '%${req.params.titulo}%' `
}
  sql += " LIMIT 100 "
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
  res.end()
}
)
}
)

app.get('/consultaLeitorEmprestimo/:nome', function (req, res) {
  var sql = ` SELECT `
  sql += " codLeitor, "
  sql += " nome "
  sql += " FROM tleitors "
  if (req.params.titulo != '0'){
  sql += ` WHERE nome like '%${req.params.nome}%' `
  sql += ` OR codLeitor like '%${req.params.nome}%' `
}
  sql += " LIMIT 100 "
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
  res.end()
}
)
}
)


app.post('/cadastraEmprestimo', function (req, res) {
  var sql
  db.beginTransaction()
  try{
    sql = "INSERT INTO "
    sql += " temprestimo " 
    sql += " (codLivro, "
    sql += " codLeitor, "
    sql += " dataInicio, "
    sql += " dataPrevisaoFim "
    sql += " ) "
    sql += " VALUES ("
    sql += ` '${req.body.codLivro}', `
    sql += ` '${req.body.codLeitor}', `
    sql += ` '${req.body.dataInicio}', `
    sql += ` '${req.body.dataFim}' `
    sql += " )"
  db.query(sql)
  sql = " UPDATE "
    sql += " tlivros "
    sql += " SET situacao = 'E' "
    sql += " WHERE "
    sql += ` codLivro = ${req.body.codLivro} `  
  db.query(sql)
  db.commit()
}
  catch{
    db.rollback()
  }
res.end();
})

app.post('/CadastroFuncionario', function (req, res) {
  var sql
  if (req.body.codFuncionario == '0'){
    sql = "INSERT INTO "
    sql += " tloginfuncionario " 
    sql += " (codFuncionario, "
    sql += " nome, "
    sql += " senha, "
    sql += " email "
    sql += " ) "
    sql += " VALUES ("
    sql += ` '${req.body.codFuncionario}', `
    sql += ` '${req.body.nome}', `
    sql += ` '${req.body.senha}', `
    sql += ` '${req.body.email}' `
    sql += " )"
  }
  else{
    sql = " UPDATE "
    sql += " tloginfuncionario "
    sql += " SET "
    sql += ` nome ='${req.body.nome}' `
    sql += ` ,senha ='${req.body.senha}' `
    sql += ` ,email ='${req.body.email}' `
    sql += ` WHERE codFuncionario = ${req.body.codFuncionario} `
  }
  console.log(sql)
  db.query(sql)
res.end();
})

app.get('/consultaFuncionario/:nome', function (req, res) {
  var sql = ` SELECT `
  sql += " codFuncionario, "
  sql += " nome, "
  sql += " senha, "
  sql += " email "
  sql += " FROM tloginfuncionario "
    sql += " WHERE 1 = 1 "
    console.log(req.params.nome)
    if (req.params.nome != '0'){
      sql += ` AND nome like '%${req.params.nome}%' `
  }
  sql += " LIMIT 100; "
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
  res.end()
}
)
}
)

app.post('/deleteFuncionario', function (req, res) {
  var sql = " DELETE "
  sql += " FROM "
  sql += " tloginfuncionario "
  sql += " WHERE "
  sql += ` codFuncionario = ${req.body.codFuncionario} `
  db.query(sql)
  res.end();
})


app.get('/consultaEmprestimo/:codLeitor/:codLivro', function (req, res) {
  var sql = ` SELECT `
  sql += " codEmprestimo, "
  sql += " Emp.codLivro, "
  sql += " titulo, "
  sql += " Emp.codLeitor, "
  sql += " Lei.nome, "
  sql += " dataInicio, "
  sql += " dataPrevisaoFim, "
  sql += " dataDevolucao, "
  sql += " CASE WHEN dataDevolucao IS NULL THEN 'Aberto' "
  sql += " ELSE 'Finalizado' End as SituacaoEmprestimo "
  sql += " FROM temprestimo Emp "
  sql += " LEFT JOIN tlivros Liv "
  sql += " ON Emp.codLivro = Liv.codLivro  "
  sql += " LEFT JOIN tleitors Lei "
  sql += " ON Lei.codLeitor = Emp.codLeitor "
    sql += ` WHERE 1=1 `
    if (req.params.codLeitor != '0'){
    sql += ` AND Lei.codLeitor = ${req.params.codLeitor} `
  }
  if (req.params.codLivro != '0'){
    sql += ` AND Liv.codLivro = ${req.params.codLivro} `
  }
  sql += " ORDER BY DataInicio DESC "
  sql += " LIMIT 100; "
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
  res.end()
}
)
}
)

app.post('/FinalizaEmprestimo', function (req, res) {
  db.beginTransaction()
    try{
    var sql
    var date = new Date()
    var mes = date.getMonth() + 1
    var dataDevolucao = new String(date.getFullYear() + "-" + mes + "-" + date.getDate())
    console.log(dataDevolucao)
    db.beginTransaction()
    sql = "UPDATE temprestimo  "
      sql += " SET " 
      sql += ` dataDevolucao = '${dataDevolucao}' ` 
      sql += " WHERE "
      sql += ` codEmprestimo = ${req.body.codEmprestimo} ` 
    db.query(sql)
    sql = " UPDATE "
      sql += " tlivros "
      sql += " SET situacao = 'D' "
      sql += " WHERE "
      sql += ` codLivro = ${req.body.codLivro} `  
    db.query(sql)
    db.commit()
  }
    catch{
      db.rollback()
    }
    res.end()
})

app.post('/cadastraReserva', function (req, res) {
  var sql
  db.beginTransaction()
  try{
    sql = "INSERT INTO "
    sql += " treserva " 
    sql += " (codLivro, "
    sql += " codLeitor, "
    sql += " dataInicio, "
    sql += " dataPrevisaoFim "
    sql += " ) "
    sql += " VALUES ("
    sql += ` '${req.body.codLivro}', `
    sql += ` '${req.body.codLeitor}', `
    sql += ` '${req.body.dataInicio}', `
    sql += ` '${req.body.dataFim}' `
    sql += " )"
  db.query(sql)
  sql = " UPDATE "
    sql += " tlivros "
    sql += " SET situacao = 'R' "
    sql += " WHERE "
    sql += ` codLivro = ${req.body.codLivro} `  
  db.query(sql)
  db.commit()
}
  catch{
    db.rollback()
  }
res.end();
})

app.post('/FinalizaReserva', function (req, res) {
  db.beginTransaction()
    try{
    var sql
    var date = new Date()
    var mes = date.getUTCMonth() + 1
    var dataReservaFim = new String(date.getFullYear() + "-" + mes + "-" + date.getDate())
    console.log(dataReservaFim)
    db.beginTransaction()
    sql = "UPDATE treserva  "
      sql += " SET " 
      sql += ` dataFinal = '${dataReservaFim}' ` 
      sql += " WHERE "
      sql += ` codReserva = ${req.body.codReserva} ` 
    db.query(sql)
    sql = " UPDATE "
      sql += " tlivros "
      sql += " SET situacao = 'D' "
      sql += " WHERE "
      sql += ` codLivro = ${req.body.codLivro} `  
    db.query(sql)
    db.commit()
  }
    catch{
      db.rollback()
    }
    res.end()
})

app.get('/consultaReserva/:codLeitor/:codLivro', function (req, res) {
  var sql = ` SELECT `
  sql += " codReserva, "
  sql += " Res.codLivro, "
  sql += " titulo, "
  sql += " Res.codLeitor, "
  sql += " Lei.nome, "
  sql += " dataInicio, "
  sql += " dataPrevisaoFim, "
  sql += " dataFinal, "
  sql += " CASE WHEN dataFinal IS NULL THEN 'Aberto' "
  sql += " ELSE 'Finalizado' End as SituacaoReserva "
  sql += " FROM treserva Res "
  sql += " LEFT JOIN tlivros Liv "
  sql += " ON Res.codLivro = Liv.codLivro  "
  sql += " LEFT JOIN tleitors Lei "
  sql += " ON Lei.codLeitor = Res.codLeitor "
    sql += ` WHERE 1=1 `
    if (req.params.codLeitor != '0'){
    sql += ` AND Lei.codLeitor = ${req.params.codLeitor} `
  }
  if (req.params.codLivro != '0'){
    sql += ` AND Liv.codLivro = ${req.params.codLivro} `
  }
  sql += " ORDER BY DataInicio DESC "
  sql += " LIMIT 100; "
  db.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
  res.end()
}
)
}
)

app.get('/estatistica/:sql', function (req, res) {
  db.query(req.params.sql, function (err, result, fields) {
    if (err) throw err;
    res.jsonp(result)
  res.end()
}
)
}
)




// db.connect(function(err,connection){
//   app.post('teste',function(req,res){
//   console.log(req.body.nome);
//     alert('teste')
// })})
