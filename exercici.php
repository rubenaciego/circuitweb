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
        else if ($name == "aleatori")
            print "Aleatoris";
        else
            print "Mixtos";
    ?></title>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="styles/main.css" />
    
    <script>
        var pageName = "<?php print $_GET["circuit"]; ?>";
        const potenciaEngergia = <?php print $_GET["potencia"] ?>;
        const resOption = <?php print $_GET["resistencies"] ?>;
        const minRes = resOption == 1 ? 10 : resOption == 2 ? 100 : resOption == 3 ? 500 : 10;  
        const maxRes = resOption == 1 ? 100 : resOption == 2 ? 1000 : resOption == 3 ? 10000 : 100;
        const maxPower = 50;
        const minPower = 5;
        const informeText = `<?php
            if ($name != "mixt")
            {
                print '<p style="margin: 10px;">Informe circuits tipus 1:</p>
                    <table style="margin: 10px;" id="table0" border="1"></table>
                    <p style="margin: 10px;" id="total0"></p>
                    <br/>
                    <p style="margin: 10px;">Informe circuits tipus 2:</p>
                    <table style="margin: 10px;" id="table1" border="1"></table>
                    <p style="margin: 10px;" id="total1"></p>';
            }
            else
            {
                print '<p style="margin: 10px;">Informe circuits:</p>
                    <table style="margin: 10px;" id="table" border="1"></table>
                    <p style="margin: 10px;" id="total"></p>';
            }
            ?>`;
    </script>
    
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="scripts/circuit.js"></script>
    <script src="scripts/exercici.js"></script>
    <script src="scripts/main.js"></script>
</head>

<body>
    <p style="margin:10px;" id="exerciseCounter"></p>
    <div id="exercicis" class="exercici"></div>
    <br/><br/>
    <div id="informeDiv"></div>

</body>

</html>
