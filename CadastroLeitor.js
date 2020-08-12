var $txtNome = $('#txtNome');
 var $txtCpf = $('#txtCpf');
 var $txtCodLeitor = $('#txtCodLeitor');
 var $txtTelefone = $('#txtTelefone');
 var $txtGenero = $('#txtGenero');
 var $btnFiltros = $('#btnFiltros');
 var $pnlFiltrosConteudo = $('#pnlFiltros');

var t = null
$(document).ready( function () {
     $txtCodLeitor.val(0).trigger('change');
     var ts = $('#result').DataTable({
          "columns": [
              null,
              null,
              { "width": "20%" },
              null,
              null,
              { "width": "10%" },
              { "width": "30%" }
            ]
       });
     t = ts;
     consultar();
 } );

 

 
function Cadastrar(){
     var leitor = RetornaObjLeitor();
     if (!leitor){
     }
     else{
          var xhr = new XMLHttpRequest();
          let json = JSON.stringify(leitor);
          var url = "/cadastroLeitor";
          xhr.open("POST",url,false);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.send(json);
          if (xhr.readyState == 4 && xhr.status == 200){
               consultar();
     }
}
};

function RetornaObjLeitor(){
     var leitor = {
          nome:$txtNome.val(),
          cpf:$txtCpf.val(),
          codLeitor:$txtCodLeitor.val(),
          telefone:$txtTelefone.val(),
          dataNascimento:document.getElementById('txtDataNascimento').value,
          genero:$txtGenero.val(),
     }
     
     if ($txtNome.val().length < 1){
          alert('Digite um nome antes de solicitar a operação');
          return
     }
     var dataCompare = new String(document.getElementById('txtDataNascimento').value);
     if (dataCompare.length < 1){
          alert('Digite uma Data de Nascimento antes de solicitar a operação');
          return
     }
     
  return leitor
}

function consultar(){
     t.clear().draw(false);
     var nome;
     if ($txtNome.val().length < 2){
          nome = "0";
     }
     else{
          nome = $txtNome.val();
     }
     var url = `/consulta/${nome}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    for (e in data){
                         var dataNascimento = new String(data[e]["dataNascimento"]);
                          t.row.add([
                              `<button type='button' class='btn btn-primary'  onclick="CarregarLeitor(${data[e]["codLeitor"]},'${data[e]["nome"]}','${data[e]["cpf"]}', '${data[e]["genero"]}','${dataNascimento.substring(0,10)}', '${data[e]["telefone"]}')"><i class="fa fa-plus" aria-hidden="true"></i></button>`,
                                                  data[e]["codLeitor"],
                                                  data[e]["nome"],
                                                  data[e]["cpf"],
                                                  data[e]["genero"],
                                                  dataNascimento.substring(0,10),
                                                  data[e]["telefone"],
                                             ]).draw(false)
                                        } 
               }
          }
          xhr.send();
};

function Deletar(){
     if ($txtCodLeitor.val() == 0){
          alert("Selecione um leitor antes de tentar excluir!")
     }
     else{
          var leitor = {
               codLeitor:$txtCodLeitor.val()
          }
          var xhr = new XMLHttpRequest();
          let json = JSON.stringify(leitor)
          var url = "/deleteLeitor";
          xhr.open("POST",url,false);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.send(json);
          if (xhr.readyState == 4 && xhr.status == 200){
               consultar()
     }
}
}


function CarregarLeitor(codLeitor, nome, cpf, genero, dataNascimento, telefone){
     $txtCodLeitor.val(codLeitor).trigger('change');
     $txtCpf.val(cpf).trigger('change');
     $txtNome.val(nome).trigger('change');
     $txtGenero.val(genero).trigger('change');
     $txtTelefone.val(telefone).trigger('change');
     document.getElementById('txtDataNascimento').value = dataNascimento
}

$btnFiltros.click(function () {
     $pnlFiltrosConteudo.collapse('toggle');
});


function zerrarCodLeitor(){
     $txtCodLeitor.val(0).trigger('change');
     $txtNome.val(null).trigger('change');
     $txtCpf.val(null).trigger('change');
     $txtGenero.val(null).trigger('change');
     $txtTelefone.val(null).trigger('change');
     document.getElementById('txtDataNascimento').value = null
}
