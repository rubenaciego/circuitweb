
var exercise;
var informes0 = [];
var informes1 = [];
const maxExercicis = 5;
var actualExercici = 0;
var circuitChanged = false;
var aleatori = pageName == "aleatori";

window.onload = nextExercise;

function nextExercise()
{
    if (actualExercici >= maxExercicis)
    {
        if (aleatori)
            pageName = "serie";
        
        generateInformes();
        return;
    }

    document.getElementById("exerciseCounter").innerText = "Exercici " + (actualExercici + 1)
        + "/" + maxExercicis;

    const div = document.getElementById("exercicis");
    div.innerHTML = "";

    div.innerHTML += '<div id="exercici"></div><br/>';

    if (aleatori)
    {
        var num = Math.random();

        if (num > 0.66)
            pageName = "mixt";
        else if (num < 0.66 && num > 0.33)
            pageName = "paralel"
        else
            pageName = "serie";
    }

    if (pageName != "mixt")
        exercise = new Exercici('exercici', pageName, Math.random() > 0.5 ? 1 : 2);
    else
        exercise = new ExerciciMixt('exercici');

    exercise.draw();
}

function onButtonPress(button)
{
    if (button.innerHTML == "Següent")
    {
        circuitChanged = false;
        nextExercise();
        return;
    }

    clearInterval(exercise.timerHandle);

    var ans = [];

    ans.push(parseFloat(document.getElementById("totalRes").value.replace(',', '.')));
    
    if (exercise.type == 1 || exercise.type == 'mixt')
        ans.push(parseFloat(document.getElementById("intensity").value.replace(',', '.')));
    else
        ans.push(parseFloat(document.getElementById("voltage").value.replace(',', '.')));
    
    for (var i = 0; i < exercise.resNum; i++)
    {
        if (exercise.type == 1 || exercise.type == 'mixt')
            ans.push(parseFloat(document.getElementById("res" + i + (pageName == 'serie' || pageName == 'mixt'? 'Voltage' : 'Intensity')).value.replace(',', '.')));
        else
            ans.push(parseFloat(document.getElementById("res" + i).value.replace(',', '.')));
    }

    if (potenciaEngergia)
    {
        ans.push(parseFloat(document.getElementById("potencia").value.replace(',', '.')));
        ans.push(parseFloat(document.getElementById("energia").value.replace(',', '.')));
    }

    var inform = exercise.checkAnswers(ans);

    if (exercise.type == 1 || exercise.type == 'mixt')
        informes0[actualExercici] = inform;
    else
        informes1[actualExercici] = inform;
    
    actualExercici++;

    return inform;
}

function startTimer(button)
{
    exercise.startTimer();
    exercise.showExercise();
    exercise.draw();
    button.remove();
}

function generateInformes()
{
    document.getElementById("informeDiv").innerHTML = informeText;

    if (pageName == 'mixt')
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
    var circuitQuantity = 0;

    for (var i = 0; i < informes0.length; i++)
    {
        if (informes0[i] == null)
            continue;
        
        circuitQuantity++;

        if (informes0[i]["Rt"] == "y")
            resistenciaTotalBe++;
        if (informes0[i]["It"] == "y")
            intensitatTotalBe++;

        var j = 0;
        while (informes0[i]["VoltageR" + j] != undefined)
        {
            if (informes0[i]["VoltageR" + j] == "y")
                voltatgesBe++;

            j++;
        }

        voltageQuantity += j;
    }

    document.getElementById("total" + (pageName == 'mixt'? '' : '0')).innerHTML = "Resistencia Total: " + resistenciaTotalBe
    + "/" + circuitQuantity + ". Intensitat Total: " + intensitatTotalBe + "/" + circuitQuantity
    + ". Voltatges: " + voltatgesBe + "/" + voltageQuantity;

    if (pageName == 'mixt')
    {
        document.getElementById("exercicis").remove();
        return;
    }

    resistenciaTotalBe = 0;
    var voltatgeTotalBe = 0;
    var resistenciesBe = 0;
    var resistenciesQuantity = 0;
    circuitQuantity = 0;

    for (var i = 0; i < informes1.length; i++)
    {
        if (informes1[i] == null)
            continue;
        
        circuitQuantity++;

        if (informes1[i]["Rt"] == "y")
            resistenciaTotalBe++;
        if (informes1[i]["Vt"] == "y")
            voltatgeTotalBe++;

        var j = 0;
        while (informes1[i]["R" + j] != undefined)
        {
            if (informes1[i]["R" + j] == "y")
                resistenciesBe++;

            j++;
        }

        resistenciesQuantity += j;
    }

    document.getElementById("total1").innerHTML = "Resistencia Total: " + resistenciaTotalBe
    + "/" + circuitQuantity + ". Voltatge Total: " + voltatgeTotalBe + "/" + circuitQuantity
    + ". Resistencies: " + resistenciesBe + "/" + resistenciesQuantity;

    document.getElementById("exercicis").remove();
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
