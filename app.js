var http = require('http')
var socket = require('socket.io')
var fs = require('fs');
var express = require('express');

//CONFIG DO DB
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
mongoose.connect(db,{useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err)); 
/* const User = require('./models/User');
const newUser = new User({
    name:'a',
    email:'b',
    password:'c'
});
newUser.save() 
var chats = []
var users = []
const Chat = require('./models/Chat');
const User = require('./models/User');
const UC = require('./models/User_chat');
const qry = Chat.find({})
qry.select('_id')
qry.exec(function(err, a){
    a.forEach(function(r){
        chats.push(r['_id'])
    })
    const qry2 = User.find({})
    qry2.select('_id')
    qry2.exec(function(err, b){
        b.forEach(function(s){
            users.push(s['_id'])
        })
        for(var i=0; i<chats.length; i++){
            for (var j=0; j<users.length; j++){
                console.log(chats[i] + ':' + users[j])
                const newUC = new UC({
                    user_id: new mongoose.Types.ObjectId(users[j]),
                    chat_id: new mongoose.Types.ObjectId(chats[i])
                });
                newUC.save().catch((error) => console.log(error))
            }
        }
    })
})*/

var app = express();
var server = http.createServer(app);
server.listen(3000)
var io = socket.listen(server)

/* var usuarios = {}
var ultimas_mensagens = [] */

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/html/index2.html');
});

app.get('/chat', function (req, res) {
    res.sendFile(__dirname + '/public/html/chat.html');
});

app.use(express.static('public'))

io.on("connection", function(socket){

    socket.on("enviar mensagem", function(mensagem, callback){
        // var mensagem = dados.msg;
        // var usuario = dados.usr;
        
        // mensagem = "[ " + pegarDataAtual() + " ] " + socket.apelido + ": " + mensagem;

        // var msgObj = {msg: mensagem, tipo: ''};

        // if (usuario == null || usuario == ''){
        //     io.sockets.emit("atualizar mensagens", msgObj);
        //     armazenarMensagem(msgObj);
        // } else {
        //     msgObj.tipo = 'privado';
        //     socket.emit("atualizar mensagens", msgObj);
        //     usuarios[usuario].emit("atualizar mensagens", msgObj);
        // }
        socket.broadcast.emit("atualizar mensagens", mensagem);
        callback();
    });

    /* socket.on("entrar", function(apelido, callback){
        if (apelido in usuarios){
            callback(false);
        } else {
            socket.apelido = apelido;
            usuarios[apelido] = socket;
            callback(true);

            ultimas_mensagens.forEach(msgObj => {
                socket.emit("atualizar mensagens", msgObj);
            });

            var mensagem = "[ " + pegarDataAtual() + " ] " + apelido + " acabou de entrar na sala";
    
            io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
            io.sockets.emit("atualizar mensagens", {msg: mensagem, tipo: 'sistema'});
        }
    });

    socket.on("disconnect", function(){
        if (socket.apelido != null){
            delete usuarios[socket.apelido];

            var mensagem = "[ " + pegarDataAtual() + " ] " + socket.apelido + " saiu da sala";
            var msgObj = {msg: mensagem, tipo: 'sistema'};

            io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
            io.sockets.emit("atualizar mensagens", msgObj);  
            
            armazenarMensagem(msgObj);
        }
    }); */
});
