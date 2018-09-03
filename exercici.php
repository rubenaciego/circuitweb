<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Circuits <?php
        $name = $_GET["circuit"];

        if ($name == "serie")
            print "Sèrie";
        else if ($name == "paralel")
            print "Paral·lel";
        else
            print "Mixtos";
    ?></title>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="styles/main.css" />
    
    <script>
        const pageName = "<?php print $_GET["circuit"]; ?>";
        const potenciaEngergia = <?php print $_GET["potencia"] ?>;
        const resOption = <?php print $_GET["resistencies"] ?>;
        const minRes = resOption == 1 ? 10 : resOption == 2 ? 100 : resOption == 3 ? 500 : 10;  
        const maxRes = resOption == 1 ? 100 : resOption == 2 ? 1000 : resOption == 3 ? 10000 : 100;
        const maxPower = 50;
        const minPower = 5;
    </script>
    
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="scripts/circuit.js"></script>
    <script src="scripts/exercici.js"></script>
    <script src="scripts/main.js"></script>
</head>

<body>
    <div id="exercicis" class="exercici"></div>
    <br/><br/>

    <?php
    if ($name != "mixt")
    {
        print '<p>Informe circuits tipus 1:</p>
            <table id="table0" border="1"></table>
            <p id="total0"></p>
            <br/>
            <p>Informe circuits tipus 2:</p>
            <table id="table1" border="1"></table>
            <p id="total1"></p>';
    }
    else
    {
        print '<p>Informe circuits:</p>
            <table id="table" border="1"></table>
            <p id="total"></p>';
    }
    ?>

</body>

</html>
