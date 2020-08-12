var $txtCodLivro =$('#txtCodLivro');
var $txtCodLeitor =$('#txtCodLeitor');
var $modalLivro = $('#modalLivro');
var $modalLeitor = $('#modalLeitor');
var $btnFiltros = $('#btnFiltros');
var $nomeLivro = $('#nomeLivro');
var $nomeLeitor = $('#nomeLeitor');
var $situacao = $('#situacaoLivro');
var $pnlFiltrosConteudo = $('#pnlFiltros');
var $txtDescModalLivro = $('#txtLivroModal');
var $txtDescModalLeitor = $('#txtLeitorModal');
var $txtDataDe = $('#txtDataDe');
var $txtDataAte = $('#txtDataAte');



var t
var a
var u
$(document).ready( function () {
    var ts = $('#dtgLivros').DataTable({
       "columns": [
           null,
           null,
           null,
           null,
         ]
    });
    t = ts;
    var ta = $('#dtgLeitores').DataTable({
        "columns": [
            null,
            null,
            null,
          ]
     });
     a = ta;
     var ds = $('#result').DataTable()
     u = ds;
     Consultar()
} );

$txtCodLeitor.change(function(){
    Consultar();
})

$txtCodLivro.change(function(){
    Consultar();
})

function abreModalLivro(){
    $modalLivro.modal('show');
}

function abreModalLeitor(){
    $modalLeitor.modal('show');
}

$btnFiltros.click(function () {
    $pnlFiltrosConteudo.collapse('toggle');
});

function PesquisarLivros(){
    t.clear().draw(false);
     var url = `/consultaLivroEmprestimo/${$txtDescModalLivro.val()}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    for (e in data){
                          t.row.add([
                              `<button type='button' class='btn btn-primary'  onclick="CarregarLivro(${data[e]["codLivro"]},'${data[e]["titulo"]}', '${data[e]["situacao"]}')"><i class="fa fa-plus" aria-hidden="true"></i></button>`,
                                                  data[e]["codLivro"],
                                                  data[e]["titulo"],
                                                  data[e]["situacao"],
                                             ]).draw(false)
                                        } 
               }
          }
          xhr.send();
}


function PesquisarLeitores(){
    a.clear().draw(false);
     var url = `/consultaLeitorEmprestimo/${$txtDescModalLeitor.val()}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    for (e in data){
                          a.row.add([
                              `<button type='button' class='btn btn-primary'  onclick="CarregarLeitor(${data[e]["codLeitor"]},'${data[e]["nome"]}')"><i class="fa fa-plus" aria-hidden="true"></i></button>`,
                                                  data[e]["codLeitor"],
                                                  data[e]["nome"],
                                             ]).draw(false)
                                        } 
               }
          }
          xhr.send();
}

function Cadastrar(){
    if ($txtDataAte.val() != "" && $txtDataAte != "" && $txtDataAte != null && $txtDataDe != null){
        if ($txtDataAte.val() > $txtDataDe.val()){
        if ($txtCodLeitor.val() != null && $txtCodLeitor.val() != ""){
            if ($txtCodLivro.val() != null && $txtCodLivro.val() != ""){
                if ($situacao.html() != "Reservado"){
                    if ($situacao.html() != "Emprestado"){
                        CadastraEmprestimo();
                    }
                    else{
                        alert("Livro está Emprestado")
                    }
                }
                else{
            alert("Livro Está Reservado")
                }
        }
        else{
            alert("Selecione Um Livro")
        }
    }
        else{
            alert("Selecione Um Leitor")
        }
    }
    else{
        alert("Data Inicial não pode ser maior que a Final")
    }
}
    else{
        alert("Confira as datas")
    }
}

function CadastraEmprestimo(){
    var livro = getObjeto();
    if (!livro){
    }
    else{
         var xhr = new XMLHttpRequest();
         let json = JSON.stringify(livro);
         var url = "/cadastraReserva";
         xhr.open("POST",url,false);
         xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
         xhr.send(json);
         if (xhr.readyState == 4 && xhr.status == 200){
             alert("Reserva Efetuado Com Sucesso");
             limpaCampos();
    }
}
}

function Consultar(){
    u.clear().draw(false);
     var codLivro;
     if (new String($txtCodLivro.val()).length < 1){
          codLivro = '0';
     }
     else{
        codLivro = $txtCodLivro.val();
     }
     var codLeitor;
     if (new String($txtCodLeitor.val()).length < 1){
          codLeitor = '0';
     }
     else{
        codLeitor = $txtCodLeitor.val();
     }
     var url = `/consultaReserva/${codLeitor}/${codLivro}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,false);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    for (e in data){
                        var dataInicio = new String(data[e]["dataInicio"]).substring(0,new String(data[e]["dataInicio"]).indexOf("T"))
                        var dataPrevisaoFim = new String(data[e]["dataPrevisaoFim"]).substring(0,new String(data[e]["dataPrevisaoFim"]).indexOf("T"))
                        var dataDevolucao = ""
                        if (data[e]["dataFinal"] != null && data[e]["dataFinal"] != "" ){
                         dataDevolucao = new String(data[e]["dataFinal"]).substring(0,new String(data[e]["dataFinal"]).indexOf("T"))
                    }
                        u.row.add([
                              `<button type='button' class='btn btn-danger'  onclick="FinalizarReserva('${data[e]["codReserva"]}', '${data[e]["codLivro"]}', '${data[e]["SituacaoReserva"]}')"><i class="fa fa-plus" aria-hidden="true"></i></button>`,
                                                  data[e]["codReserva"],
                                                  data[e]["codLivro"],
                                                  data[e]["titulo"],
                                                  data[e]["codLeitor"],
                                                  data[e]["nome"],
                                                  dataInicio,
                                                  dataPrevisaoFim,
                                                  dataDevolucao,
                                                  data[e]["SituacaoReserva"],
                                             ]).draw(false)
                                        } 
               }
          }
          xhr.send();
}


function FinalizarReserva(codReserva,codLivro, situacao){
    if (situacao != "Aberto"){
        alert("Reserva já finalizada");
    }
    else if(confirm("Quer Finalizar esta reserva?")){
        var body = {
            codLivro:codLivro,
            codReserva:codReserva,
        }
        var xhr = new XMLHttpRequest();
        let json = JSON.stringify(body);
        var url = "/FinalizaReserva";
        xhr.open("POST",url,false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send(json);
        if (xhr.readyState == 4 && xhr.status == 200){
        alert("Empréstimo Finalizado com Sucesso!")
            Consultar();
   }
}
}

function getObjeto(){
    var reserva = {
        codLivro:$txtCodLivro.val(),
        codLeitor:$txtCodLeitor.val(),
        dataInicio:$txtDataDe.val(),
        dataFim:$txtDataAte.val(),
   }
   return reserva
}


function CarregarLivro(codLivro, nome,situacao){
    $txtCodLivro.val(codLivro).trigger('change');
    $nomeLivro.html(nome);
    $situacao.html(situacao);
    $modalLivro.modal('hide');
}


function CarregarLeitor(codLeitor, nome){
    $txtCodLeitor.val(codLeitor).trigger('change');
    $nomeLeitor.html(nome);
    $modalLeitor.modal('hide');
}

function limpaCampos(){
    $txtCodLeitor.val(null).trigger('change');
    $nomeLeitor.html(null);
    $txtCodLivro.val(null).trigger('change');
    $nomeLivro.html(null);
    $situacao.html(null);
}

