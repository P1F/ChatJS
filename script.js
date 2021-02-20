$(document).ready(function(){
    var socket = io.connect();

    $('form#login').submit(function(e){
        e.preventDefault();
        socket.emit("entrar", $(this).find('#apelido').val(), function(valido){
            if (valido){
                $('#acesso_usuario').hide();
                $('#sala_chat').show();
            } else {
                $('form#login').val("");
                alert("Nome ja utilizado nesta sala");
            }
        });
    });

    $('form#chat').submit(function(e){
        e.preventDefault();

        var mensagem = $(this).find('#texto_mensagem').val();
        var usuario = $('#lista_usuarios').val();

        socket.emit("enviar mensagem", {msg: mensagem, usr: usuario}, function(){
            $('form#chat #texto_mensagem').val("");
        });
    });
    socket.on("atualizar mensagens", function(dados){
        var mensagem = dados.msg;
        var tipo = dados.tipo;
        let teste = [];

        var mensagem_formatada = $(`<p>${mensagem}</p>`).addClass(tipo);
        $('#historico_mensagens').append(mensagem_formatada);
    });
    socket.on("atualizar usuarios", function(usuarios){
        $('#lista_usuarios').empty();
        $("#lista_usuarios").append("<option value=''>Participantes</option>");
        usuarios.forEach(usuario => {
            var usuario_formatado = `<option value='${usuario}'>${usuario}</option>`;
            $('#lista_usuarios').append(usuario_formatado);
        });
    });
});