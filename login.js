 var $txtUsuario = $('#txtUsuario');
 var $txtSenha = $('#txtSenha');
 var $btnLogar = $('#btnLogar');

$(document).ready( function () {
 } );

 

 
$btnLogar.click(function(e){
    e.preventDefault();
    if (verificaLogin() == "erro"){

    }
    else{

    }
})


function verificaLogin(){
     if ($txtUsuario.val().length < 2){
          alert("Não Existe Usuário no banco com esse login")
            return "erro"
        }
     var url = `/verificaUsuario/${$txtUsuario.val()}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    var existe = false
                    for (e in data){
                        existe = true
               }
               if (existe){
                    verificaSenha()
               }
               else{
                   alert("Não existe esse usuário");
               }
            }
          }
          xhr.send();
};

function verificaSenha(nome, senha){
    var url = `/verificaSenha/${$txtUsuario.val()}/${$txtSenha.val()}`;
    var xhr = new XMLHttpRequest();
    xhr.open('get',url,true);
    xhr.onreadystatechange = function(){
         if (xhr.readyState == 4 && xhr.status == 200){
              var data = JSON.parse(xhr.responseText);
              var existe = false
              for (e in data){
                  existe = true
         }
         if (existe){
              window.location.href = "/index"
         }
         else{
             alert("Verifique o usuário e a senha");
         }
      }
    }
    xhr.send();
}

function limpaCampos(){
     $txtSenha.val(null).trigger('change');
     $txtUsuario.val(null).trigger('change');
}
