
var exercise = [];
var informes0 = [null, null, null];
var informes1 = [null, null, null];
const numExercicis = 3;

window.onload = function() {
    const div = document.getElementById("exercicis");
    
    for (var i = 0; i < numExercicis; i++)
    {
        div.innerHTML += '<div id="exercici' + i + '"></div><br/>';

        if (pageName != "mixt")
            exercise[i] = new Exercici('exercici' + i, pageName, Math.random() > 0.5 ? 1 : 2);
        else
            exercise[i] = new ExerciciMixt('exercici' + i);
    }

    for (var i = 0; i < numExercicis; i++)
        exercise[i].draw();
}

function onButtonPress(button)
{
    const instance = parseInt(button.id);

    var ans = [];

    ans.push(parseFloat(document.getElementById("totalRes" + instance).value));
    
    if (exercise[instance].type == 1 || exercise[instance].type == 'mixt')
        ans.push(parseFloat(document.getElementById("intensity" + instance).value));
    else
        ans.push(parseFloat(document.getElementById("voltage" + instance).value));
    
    for (var i = 0; i < exercise[instance].resNum; i++)
    {
        if (exercise[instance].type == 1 || exercise[instance].type == 'mixt')
            ans.push(parseFloat(document.getElementById("res" + i + (pageName == 'serie' || pageName == 'mixt'? 'Voltage' : 'Intensity') + instance).value));
        else
            ans.push(parseFloat(document.getElementById("res" + i + instance).value));
    }

    if (potenciaEngergia)
    {
        ans.push(parseFloat(document.getElementById("potencia" + instance).value));
        ans.push(parseFloat(document.getElementById("energia" + instance).value));
    }

    exercise[instance].intents++;
    var inform = exercise[instance].checkAnswers(ans);

    if (exercise[instance].type == 1 || exercise[instance].type == 'mixt')
        informes0[instance] = inform;
    else
        informes1[instance] = inform;

    return inform;
}

function onRefreshPress(button)
{
    instance = parseInt(button.id.split("refresh")[1]);

    document.getElementById("exercici" + instance).innerHTML = "";
    exercise[instance] = new Exercici('exercici' + instance, pageName, Math.random() > 0.5 ? 1 : 2, instance);
    exercise[instance].draw();
}

function startTimer(button)
{
    exercise[parseInt(button.id.split("timer")[1])].startTimer();
    button.remove();
}

function generateInformes()
{
    if (exercise[0].type == 'mixt')
    {
        document.getElementById("table").innerHTML = "";
        buildHtmlTable("#table" ,informes0);
    }
    else
    {
        document.getElementById("table0").innerHTML = "";
        document.getElementById("table1").innerHTML = "";
        buildHtmlTable("#table0" ,informes0);
        buildHtmlTable("#table1" ,informes1);
    }

    var resistenciaTotalBe = 0;
    var intensitatTotalBe = 0;
    var voltatgesBe = 0;
    var voltageQuantity = 0;

    for (var i = 0; i < informes0.length; i++)
    {
        if (informes0[i] == null)
            continue;

        if (informes0[i]["ResistenciaTotal"] == "be")
            resistenciaTotalBe++;
        if (informes0[i]["IntensitatTotal"] == "be")
            intensitatTotalBe++;

        var j = 0;
        while (informes0[i]["VoltageResistencia" + j] != undefined)
        {
            if (informes0[i]["VoltageResistencia" + j] == "be")
                voltatgesBe++;

            j++;
        }

        voltageQuantity += j;
    }

    document.getElementById("total" + (exercise[0].type == 'mixt'? '' : '0')).innerHTML = "Resistencia Total: " + resistenciaTotalBe
    + "/" + informes0.length + ". Intensitat Total: " + intensitatTotalBe + "/" + informes0.length
    + ". Voltatges: " + voltatgesBe + "/" + voltageQuantity;

    if (exercise[0].type == 'mixt')
        return;

    resistenciaTotalBe = 0;
    intensitatTotalBe = 0;
    var resistenciesBe = 0;
    var resistaenciesQuantity = 0;

    for (var i = 0; i < informes1.length; i++)
    {
        if (informes1[i] == null)
            continue;

        if (informes1[i]["ResistenciaTotal"] == "be")
            resistenciaTotalBe++;
        if (informes1[i]["IntensitatTotal"] == "be")
            intensitatTotalBe++;

        var j = 0;
        while (informes1[i]["Resistencia" + j] != undefined)
        {
            if (informes1[i]["Resistencia" + j] == "be")
                resistenciesBe++;

            j++;
        }

        resistaenciesQuantity += j;
    }

    document.getElementById("total1").innerHTML = "Resistencia Total: " + resistenciaTotalBe
    + "/" + informes0.length + ". Intensitat Total: " + intensitatTotalBe + "/" + informes0.length
    + ". Resistencies: " + resistenciesBe + "/" + resistaenciesQuantity;
}

function buildHtmlTable(selector, myList)
{
    var columns = addAllColumnHeaders(myList, selector);
  
    for (var i = 0; i < myList.length; i++)
    {
        if (myList[i] == null)
            continue;

      var row$ = $('<tr/>');

      for (var colIndex = 0; colIndex < columns.length; colIndex++)
      {
        var cellValue = myList[i][columns[colIndex]];
        if (cellValue == null) cellValue = "";
        row$.append($('<td/>').html(cellValue));
      }

      $(selector).append(row$);
    }
}

function addAllColumnHeaders(myList, selector)
{
    var columnSet = [];
    var headerTr$ = $('<tr/>');
  
    for (var i = 0; i < myList.length; i++)
    {
        if (myList[i] == null)
            continue;

      var rowHash = myList[i];

      for (var key in rowHash)
      {
        if ($.inArray(key, columnSet) == -1)
        {
          columnSet.push(key);
          headerTr$.append($('<th/>').html(key));
        }
      }
    }

    $(selector).append(headerTr$);
  
    return columnSet;
}
