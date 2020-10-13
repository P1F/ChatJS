var app = require('http').createServer(response);
var fs = require('fs');
const { toUnicode } = require('punycode');
var io = require('socket.io')(app);
var usuarios = {};
var ultimas_mensagens = [];

app.listen(3000);
console.log("Aplicação está em execução...");

function response(req, res){
    var file = "";
    if (req.url == '/'){
        file = __dirname + '/index.html';
    } else {
        file = __dirname + req.url;
    }
    
    fs.readFile(file, function(err, data){
        if (err){
            res.writeHead(500);
            return res.end("Erro ao carregar o arquivo index.html");
        }
        
        res.writeHead(200);
        res.end(data);
    });
}

function pegarDataAtual(){
    var dataAtual = new Date();
    var dia = (dataAtual.getDate()<10 ? '0' : '') + dataAtual.getDate();
    var mes = ((dataAtual.getMonth() + 1)<10 ? '0' : '') + (dataAtual.getMonth() + 1);
    var ano = dataAtual.getFullYear();
    var hora = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
    var minuto = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();
    var segundo = (dataAtual.getSeconds()<10 ? '0' : '') + dataAtual.getSeconds();
  
    var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
    return dataFormatada;
}

function armazenarMensagem(msgObj){
    if (ultimas_mensagens.length > 5){
        ultimas_mensagens.shift();
    }
    ultimas_mensagens.push(msgObj);
}

io.on("connection", function(socket){
    socket.on("enviar mensagem", function(dados, callback){
        var mensagem = dados.msg;
        var usuario = dados.usr;
        
        mensagem = "[ " + pegarDataAtual() + " ] " + socket.apelido + ": " + mensagem;

        var msgObj = {msg: mensagem, tipo: ''};

        if (usuario == null || usuario == ''){
            io.sockets.emit("atualizar mensagens", msgObj);
            armazenarMensagem(msgObj);
        } else {
            msgObj.tipo = 'privado';
            socket.emit("atualizar mensagens", msgObj);
            usuarios[usuario].emit("atualizar mensagens", msgObj);
        }

        callback();
    });

    socket.on("entrar", function(apelido, callback){
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
    });
});