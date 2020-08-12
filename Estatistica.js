var $btnFiltros = $('#btnFiltros');
var $pnlFiltrosConteudo = $('#pnlFiltros');
var rdbGroup = document.getElementsByName('group');
var rdbView = document.getElementsByName('view');
var $btnConsultar = $('#btnConsultar');
var ctx = document.getElementById('myChart').getContext('2d');

$(document).ready( function () {
})
var myChart

$btnFiltros.click(function () {
    $pnlFiltrosConteudo.collapse('toggle');
});

$btnConsultar.click(function(){
    for (i in rdbGroup){
        if (rdbGroup[i].checked){
            criaConsulta(rdbGroup[i].value);
        }
    }
})

function criaConsulta(grupo){
    for (i in rdbView){
        if (rdbView[i].checked){
            if (rdbView[i].value == "E"){
                var table = " temprestimo "
                CarregaBase(grupo, table, " codEmprestimo ", " Empréstimos ");
            }
            else if (rdbView[i].value == "R"){
                var table = " treserva "
                CarregaBase(grupo, table," codReserva " , " Reservas ");
            }
            else{
                carregaAmbos(grupo);
            }
        }
    }
};


function carregaAmbos(grupo){
    var date =  new Date()
    var datapassada = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
    var sql
    if( grupo == "S"){
        sql = ` SELECT sum(qtde) as qtde, `
        sql += ` semestre FROM( `
        sql += ` SELECT count(codEmprestimo) as qtde, `
        sql += ` CASE WHEN Month(dataInicio) <=6 THEN 1 `
        sql += ` ELSE 2 END as semestre FROM temprestimo `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' ` 
        sql += ` Group by semestre `
        sql += ` UNION `
        sql += ` SELECT count(codReserva) as qtde, `
        sql += ` CASE WHEN Month(dataInicio) <=6 THEN 1 `
        sql += ` ELSE 2 END as semestre FROM treserva `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' `
        sql += ` Group by semestre) as Ambos Group by Semestre; `
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var semestres = []
                        var qtdes = []
                        for (i in data){
                            semestres.push(data[i].semestre)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoAmbos(semestres,qtdes," Ambos ", " Semestre ")
               }
          }
          xhr.send();
    }
    else if( grupo == "A"){
        sql = ` SELECT sum(qtde) as qtde, `
        sql += ` ano FROM( `
        sql += ` SELECT count(codEmprestimo) as qtde, `
        sql += ` Year(dataInicio) as Ano `
        sql += `  FROM temprestimo `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' ` 
        sql += ` Group by ano `
        sql += ` UNION `
        sql += ` SELECT count(codReserva) as qtde, `
        sql += ` Year(dataInicio) as Ano  `
        sql += ` FROM treserva `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' `
        sql += ` Group by ano) as Ambos Group by ano; `
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var anos = []
                        var qtdes = []
                        for (i in data){
                            anos.push(data[i].ano)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoAmbos(anos,qtdes," Ambos ", " Ano ")
               }
          }
          xhr.send();
    }
    else if( grupo == "T"){
        sql = ` SELECT sum(qtde) as qtde, `
        sql += ` trimestre FROM( `
        sql += ` SELECT count(codEmprestimo) as qtde, ` 
        sql+= ` CASE WHEN Month(dataInicio) <=3 THEN 1 ` 
        sql+= ` WHEN Month(dataInicio) <= 6 THEN 2 ` 
        sql+= ` WHEN Month(dataInicio) <= 9 THEN 3 ` 
        sql+= ` ELSE 12 END as trimestre FROM temprestimo ` 
        sql+= ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' ` 
        sql+= ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' ` 
        sql+= ` group by trimestre ` 
        sql += ` UNION `
        sql += ` SELECT count(codReserva) as qtde, ` 
        sql+= ` CASE WHEN Month(dataInicio) <=3 THEN 1 ` 
        sql+= ` WHEN Month(dataInicio) <= 6 THEN 2 ` 
        sql+= ` WHEN Month(dataInicio) <= 9 THEN 3 ` 
        sql+= ` ELSE 12 END as trimestre FROM treserva ` 
        sql+= ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' ` 
        sql+= ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' ` 
        sql+= ` group by trimestre `
        sql += ` ) as Ambos Group by trimestre; `
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var trimeses = []
                        var qtdes = []
                        for (i in data){
                            trimeses.push(data[i].trimestre)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoAmbos(trimeses,qtdes," Ambos ", " Trimestre ")
               }
          }
          xhr.send();
    }

    else if( grupo == "B"){
        sql = ` SELECT sum(qtde) as qtde, `
        sql += ` bimestre FROM( `
        sql += ` SELECT count(codEmprestimo) as qtde,`
        sql += ` CASE WHEN Month(dataInicio) <=2 THEN 1 `
        sql += ` WHEN Month(dataInicio) <= 4 THEN 2 `
        sql += ` WHEN Month(dataInicio) <= 6 THEN 3 `
        sql += ` WHEN Month(dataInicio) <= 8 THEN 4 `
        sql += ` WHEN Month(dataInicio) <= 10 THEN 5 `
        sql += ` ELSE 6 END as bimestre FROM temprestimo `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}'  `
        sql += ` group by bimestre `
        sql += ` UNION `
        sql += ` SELECT count(codReserva) as qtde,`
        sql += ` CASE WHEN Month(dataInicio) <=2 THEN 1 `
        sql += ` WHEN Month(dataInicio) <= 4 THEN 2 `
        sql += ` WHEN Month(dataInicio) <= 6 THEN 3 `
        sql += ` WHEN Month(dataInicio) <= 8 THEN 4 `
        sql += ` WHEN Month(dataInicio) <= 10 THEN 5 `
        sql += ` ELSE 6 END as bimestre FROM treserva `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}'  `
        sql += ` group by bimestre `
        sql += ` ) as Ambos Group by bimestre; `
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var bimeses = []
                        var qtdes = []
                        for (i in data){
                            bimeses.push(data[i].bimestre)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoAmbos(bimeses,qtdes," Ambos ", " Bimestre ")
               }
          }
          xhr.send();
    }

    else if( grupo == "M"){
        sql = ` SELECT sum(qtde) as qtde, `
        sql += ` mes FROM( `
        sql += " SELECT "
        sql += ` count(codEmprestimo) AS qtde, `
        sql += " Month(dataInicio) AS mes "
        sql += ` FROM temprestimo `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' `
        sql += " group by Month(dataInicio) "
        sql += ` UNION `
        sql += " SELECT "
        sql += ` count(codReserva) AS qtde, `
        sql += " Month(dataInicio) AS mes "
        sql += ` FROM treserva `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' `
        sql += " group by Month(dataInicio) "
        sql += ` ) as Ambos Group by mes; `
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var meses = []
                        var qtdes = []
                        for (i in data){
                            meses.push(data[i].mes)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoAmbos(meses,qtdes," Ambos ", " Mes ")
               }
          }
          xhr.send();
    }

    else if( grupo == "D"){
        sql = ` SELECT sum(qtde) as qtde, `
        sql += ` dia FROM( `
        sql += " SELECT "
        sql += ` count(codEmprestimo) AS qtde, `
        sql += " Day(dataInicio) AS dia "
        sql += ` FROM temprestimo `
        sql += ` WHERE dataInicio >= '${datapassada.getFullYear() + "-" + datapassada.getMonth() + "-" +  datapassada.getDate()}' `
        sql += ` And dataInicio < now() `
        sql += " group by Day(dataInicio) "
        sql += ` UNION ALL `
        sql += " SELECT "
        sql += ` count(codReserva) AS qtde, `
        sql += " Day(dataInicio) AS dia "
        sql += ` FROM treserva `
        sql += ` WHERE dataInicio >= '${datapassada.getFullYear() + "-" + datapassada.getMonth() + "-" +  datapassada.getDate()}' `
        sql += ` And dataInicio < now() `
        sql += " group by Day(dataInicio) "
        sql += ` ) as Ambos Group by dia; `
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var dias = []
                        var qtdes = []
                        for (i in data){
                            dias.push(data[i].dia)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoAmbos(dias,qtdes," Ambos ", " Dia ")
               }
          }
          xhr.send();
    }

    else if (grupo == "A"){
        sql = ` SELECT sum(qtde) as qtde, `
        sql += ` ano FROM( `
        sql += ` SELECT count(${campoBase}) as qtde, ` 
        sql+= ` Year(dataInicio) as Ano FROM ${tabela} ` 
        sql+= ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' ` 
        sql+= ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' ` 
        sql+= ` group by Ano ` 
        sql += ` UNION `
        sql += ` SELECT count(${campoBase}) as qtde, ` 
        sql+= ` Year(dataInicio) as Ano FROM ${tabela} ` 
        sql+= ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' ` 
        sql+= ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' ` 
        sql+= ` group by Ano` 
        sql += `) as Ambos Group by ano; `
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var anos = []
                        var qtdes = []
                        for (i in data){
                            anos.push(data[i].ano)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoAmbos(anos,qtdes,tipo, " Ano ")
               }
          }
          xhr.send();
    }
}

function carregaGraficoAmbos(meses, qtde,tipo,tempo){
    if (myChart){
        myChart.destroy()
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: `Quantidade de ${tipo} por ${tempo}`,
                data:qtde,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function CarregaBase(grupo,tabela,campoBase,tipo){
    var date =  new Date()
    var datapassada = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
    var sql
    if (grupo == "D"){
        sql = " SELECT "
        sql += ` count(${campoBase}) AS qtde, `
        sql += " Day(dataInicio) AS dia "
        sql += ` FROM ${tabela} `
        sql += ` WHERE dataInicio >= '${datapassada.getFullYear() + "-" + datapassada.getMonth() + "-" +  datapassada.getDate()}' `
        sql += ` And dataInicio < now() `
        sql += " group by Day(dataInicio); "
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var dias = []
                        var qtdes = []
                        for (i in data){
                            dias.push(data[i].dia)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoMes(dias,qtdes,tipo, " Dia ")
               }
          }
          xhr.send();
    }
    else if(grupo == "M"){
        sql = " SELECT "
        sql += ` count(${campoBase}) AS qtde, `
        sql += " Month(dataInicio) AS mes "
        sql += ` FROM ${tabela} `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' `
        sql += " group by Month(dataInicio); "
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var meses = []
                        var qtdes = []
                        for (i in data){
                            meses.push(data[i].mes)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoMes(meses,qtdes,tipo," Mês ")
               }
          }
          xhr.send();
    }
    else if(grupo == "B"){
        sql = ` SELECT count(${campoBase}) as qtde,`
        sql += ` CASE WHEN Month(dataInicio) <=2 THEN 1 `
        sql += ` WHEN Month(dataInicio) <= 4 THEN 2 `
        sql += ` WHEN Month(dataInicio) <= 6 THEN 3 `
        sql += ` WHEN Month(dataInicio) <= 8 THEN 4 `
        sql += ` WHEN Month(dataInicio) <= 10 THEN 5 `
        sql += ` ELSE 6 END as bimestre FROM ${tabela} `
        sql += ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' `
        sql += ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}'  `
        sql += ` group by bimestre; `
        
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var bimeses = []
                        var qtdes = []
                        for (i in data){
                            bimeses.push(data[i].bimestre)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoMes(bimeses,qtdes,tipo, " Bimestre ")
               }
          }
          xhr.send();
    }
    else if(grupo == "T"){
        sql = ` SELECT count(${campoBase}) as qtde, ` 
        sql+= ` CASE WHEN Month(dataInicio) <=3 THEN 1 ` 
        sql+= ` WHEN Month(dataInicio) <= 6 THEN 2 ` 
        sql+= ` WHEN Month(dataInicio) <= 9 THEN 3 ` 
        sql+= ` ELSE 12 END as trimestre FROM ${tabela} ` 
        sql+= ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' ` 
        sql+= ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' ` 
        sql+= ` group by trimestre; ` 
        
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var trimeses = []
                        var qtdes = []
                        for (i in data){
                            trimeses.push(data[i].trimestre)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoMes(trimeses,qtdes,tipo, "Trimestre")
               }
          }
          xhr.send();
    }
    else if(grupo == "S"){
        sql = ` SELECT count(${campoBase}) as qtde, ` 
        sql+= ` CASE WHEN Month(dataInicio) <=6 THEN 1 ` 
        sql+= ` ELSE 2 END as semestre FROM ${tabela} ` 
        sql+= ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' ` 
        sql+= ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' ` 
        sql+= ` group by semestre; ` 
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var semeses = []
                        var qtdes = []
                        for (i in data){
                            semeses.push(data[i].semestre)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoMes(semeses,qtdes,tipo, " Semestre ")
               }
          }
          xhr.send();
    }
    else if(grupo == "A"){
        sql = ` SELECT count(${campoBase}) as qtde, ` 
        sql+= ` Year(dataInicio) as Ano FROM ${tabela} ` 
        sql+= ` WHERE dataInicio >= '${date.getFullYear() + "-" + 01 + "-" +  01}' ` 
        sql+= ` AND dataInicio < '${date.getFullYear() + 1 + "-" + 01 + "-" +  01}' ` 
        sql+= ` group by Ano; ` 
        var url = `/estatistica/${sql}`;
          var xhr = new XMLHttpRequest();
          xhr.open('get',url,true);
          xhr.onreadystatechange = function(){
               if (xhr.readyState == 4 && xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                        var anos = []
                        var qtdes = []
                        for (i in data){
                            anos.push(data[i].Ano)
                            qtdes.push(data[i].qtde)
                        }
                        carregaGraficoMes(anos,qtdes,tipo, " Ano ")
               }
          }
          xhr.send();
    }
}



function carregaGraficoMes(meses, qtde,tipo,tempo){
    if (myChart){
        myChart.destroy()
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: `Quantidade de ${tipo} por ${tempo}`,
                data:qtde,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(255, 99, 132, 0.2)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}







