var $txtNome = $('#txtNome');
 var $txtCodFuncionario = $('#txtCodFuncionario');
 var $txtEmail = $('#txtEmail');
 var $txtSenha = $('#txtSenha');
 var $btnFiltros = $('#btnFiltros');
 var $pnlFiltrosConteudo = $('#pnlFiltros');

var t = null
$(document).ready( function () {
     $txtCodFuncionario.val(0).trigger('change');
     var ts = $('#result').DataTable({
          "columns": [
              null,
              null,
              null,
              null,
            ]
       });
     t = ts;
     consultar();
 } );

 

 
function Cadastrar(){
     var funcionario = RetornaObjFuncionario();
     if (!funcionario){
     }
     else{
          var xhr = new XMLHttpRequest();
          let json = JSON.stringify(funcionario);
          var url = "/CadastroFuncionario";
          xhr.open("POST",url,false);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.send(json);
          if (xhr.readyState == 4 && xhr.status == 200){
               consultar();
     }
}
};

function RetornaObjFuncionario(){
     var funcionario = {
         codFuncionario:$txtCodFuncionario.val(),
          nome:$txtNome.val(),
          senha:$txtSenha.val(),
          email:$txtEmail.val(),
     }
     
     if ($txtNome.val().length < 1){
          alert('Digite um nome antes de solicitar a operação');
          return
     }
     if ($txtSenha.val().length < 1){
        alert('Digite uma senha antes de solicitar a operação');
        return
   }
  return funcionario
}

function consultar(){
     t.clear().draw(false);
     var nome;
     if (new String($txtNome.val()).length <= 2){
          nome = '0';
     }
     else{
          nome = $txtNome.val();
     }
     var url = `/consultaFuncionario/${nome}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,false);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    for (e in data){
                        var email = ""
                        if (data[e]["email"] != 'null' && data[e]["email"] != null && data[e]["email"] != ''){
                            email = data[e]["email"];
                        }
                          t.row.add([
                              `<button type='button' class='btn btn-primary'  onclick="CarregarFuncionario(${data[e]["codFuncionario"]},'${data[e]["nome"]}','${data[e]["email"]}', '${data[e]["senha"]}')"><i class="fa fa-plus" aria-hidden="true"></i></button>`,
                                                  data[e]["codFuncionario"],
                                                  data[e]["nome"],
                                                  email,
                                             ]).draw(false)
                                        } 
               }
          }
          xhr.send();
};

function Deletar(){
     if ($txtCodFuncionario.val() == 0){
          alert("Selecione um funcionario antes de tentar excluir!")
     }
     else{
          var funcionario = {
               codFuncionario:$txtCodFuncionario.val()
          }
          var xhr = new XMLHttpRequest();
          let json = JSON.stringify(funcionario)
          var url = "/deleteFuncionario";
          xhr.open("POST",url,false);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.send(json);
          if (xhr.readyState == 4 && xhr.status == 200){
              zerrarCodFuncionario()
              t.clear().draw(false);
               consultar()
     }
}
}


function CarregarFuncionario(codFuncionario, nome, email,senha){
     $txtCodFuncionario.val(codFuncionario).trigger('change');
     $txtSenha.val(senha).trigger('change');
     if (email == 'null' || email == null || email == ''){
         email = ""
     }
     $txtEmail.val(email).trigger('change');
     $txtNome.val(nome).trigger('change');
}

$btnFiltros.click(function () {
     $pnlFiltrosConteudo.collapse('toggle');
});


function zerrarCodFuncionario(){
     $txtCodFuncionario.val(0).trigger('change');
     $txtNome.val(null).trigger('change');
     $txtSenha.val(null).trigger('change');
    
     $txtEmail.val(null).trigger('change');
}
