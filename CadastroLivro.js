var $txtNome = $('#txtNome');
 var $txtTitulo = $('#txtTitulo');
 var $txtCodLivro = $('#txtCodLivro');
 var $txtEditora = $('#txtEditora');
 var $txtAutor = $('#txtAutor');
 var $txtGenero = $('#txtGenero');
 var $txtSinopse = $('#txtSinopse');
 var $btnFiltros = $('#btnFiltros');
 var $pnlFiltrosConteudo = $('#pnlFiltros');

var t = null
$(document).ready( function () {
     $txtCodLivro.val(0).trigger('change');
     var ts = $('#result').DataTable({
        "columns": [
            null,
            null,
            { "width": "20%" },
            null,
            null,
            { "width": "20%" },
            { "width": "70%" },
            null,
          ]
     });
     t = ts;
     consultar();
     
 } );

 

 
function Cadastrar(){
     var livro = RetornaObjLivro();
     if (!livro){
     }
     else{
          var xhr = new XMLHttpRequest();
          let json = JSON.stringify(livro);
          var url = "/cadastroLivro";
          xhr.open("POST",url,false);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.send(json);
          if (xhr.readyState == 4 && xhr.status == 200){
               consultar();
     }
}
};

function RetornaObjLivro(){
     var livro = {
          titulo:$txtTitulo.val(),
          autor:$txtAutor.val(),
          codLivro:$txtCodLivro.val(),
          generos:$txtGenero.val(),
          sinopse:$txtSinopse.val(),
          editora:$txtEditora.val(),
     }
     
     if ($txtTitulo.val().length < 1){
          alert('Digite um titulo antes de solicitar a operação');
          return
     }
     if ($txtGenero.val().length < 1){
          alert('Digite ao menos um genero antes de solicitar a operação');
          return
     }
     
  return livro
}

function consultar(){
     t.clear().draw(false);
     var titulo;
     if ($txtTitulo.val().length < 2){
          titulo = "0";
     }
     else{
        titulo = $txtTitulo.val();
     }
     var url = `/consultaLivro/${titulo}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    for (e in data){
                          t.row.add([
                              `<button type='button' class='btn btn-primary'  onclick="CarregarLivro(${data[e]["codLivro"]},'${data[e]["titulo"]}','${data[e]["autor"]}', '${data[e]["generos"]}','${data[e]["sinopse"]}', '${data[e]["editora"]}')"><i class="fa fa-plus" aria-hidden="true"></i></button>`,
                                                  data[e]["codLivro"],
                                                  data[e]["titulo"],
                                                  data[e]["autor"],
                                                  data[e]["editora"],
                                                  data[e]["generos"],
                                                  data[e]["sinopse"],
                                                  data[e]["situacao"],
                                             ]).draw(false)
                                        } 
               }
          }
          xhr.send();
};

function Deletar(){
     if ($txtCodLivro.val() == 0){
          alert("Selecione um livro antes de tentar excluir!")
     }
     else{
          var livro = {
               codLivro:$txtCodLivro.val()
          }
          var xhr = new XMLHttpRequest();
          let json = JSON.stringify(livro)
          var url = "/deleteLivro";
          xhr.open("POST",url,false);
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.send(json);
          if (xhr.readyState == 4 && xhr.status == 200){
               consultar()
     }
}
}


function CarregarLivro(codLivro, titulo, autor, generos,  sinopse,editora){
     $txtCodLivro.val(codLivro).trigger('change');
     $txtTitulo.val(titulo).trigger('change');
     $txtAutor.val(autor).trigger('change');
     $txtGenero.val(generos).trigger('change');
     $txtEditora.val(editora).trigger('change');
     $txtSinopse.val(sinopse).trigger('change');
}

$btnFiltros.click(function () {
     $pnlFiltrosConteudo.collapse('toggle');
});


function zerraCodLivro(){
     $txtCodLivro.val(0).trigger('change');
     $txtTitulo.val(null).trigger('change');
     $txtAutor.val(null).trigger('change');
     $txtGenero.val(null).trigger('change');
     $txtEditora.val(null).trigger('change');
     $txtSinopse.val(null).trigger('change');
}
