
var instances = 0;
const tolerance = 0.02;

class Exercici
{
    constructor(divID, circuitType, type, instance = null)
    {
        if (circuitType != 'serie' && circuitType != 'paralel')
            return;

        if (circuitType == 'paralel')
            type = 1;
        
        if (potenciaEngergia)
            this.time = parseInt(Math.random() * 200 + 50);
        
        if (instance == null)
        {
            this.instance = instances;
            instances++;
        }
        else
            this.instance = instance;

        this.divContainer = document.getElementById(divID);
        this.type = type;
        this.intents = 0;
        this.seconds = 0;

        if (this.type == 1)
        {
            this.divContainer.innerHTML = `<p id="enunciat` + this.instance + `"></p>
            <canvas id="circuitDrawing` + this.instance + `" width="500" height="100"></canvas>

            <p><input type="text" id="totalRes` + this.instance + `"> Resistència total (Ohms)</p>
            <p><input type="text" id="intensity` + this.instance + `"> Intensitat total (A)</p>
            
            <div id="${circuitType == 'serie'? 'voltages' : 'intensities'}` + this.instance + `"></div>`
            + (potenciaEngergia? '<p><input type="text" id="potencia' + this.instance + `"> Potència total (W)</p>
            <p><input type="text" id="energia` + this.instance + `"> Energia (en Joules) consumida en ` + this.time +` segons</p>`
            : '') + `<button type="button" id="${this.instance}" onclick="onButtonPress(this);">Comprova</button>
            <button type="button" id="refresh${this.instance}" onclick="onRefreshPress(this);">Refer</button>`;
        }
        else
        {
            this.divContainer.innerHTML = `<p id="enunciat` + this.instance + `"></p>
            <canvas id="circuitDrawing` + this.instance + `" width="500" height="100"></canvas>

            <p><input type="text" id="totalRes` + this.instance + `"> Resistència total (Ohms)</p>
            <p><input type="text" id="voltage` + this.instance + `"> Voltatge total (V)</p>
            
            <div id="resistencies` + this.instance + `"></div>`
            + (potenciaEngergia? '<p><input type="text" id="potencia' + this.instance + `"> Potència total (W)</p>
            <p><input type="text" id="energia` + this.instance + `"> Energia (en Joules) consumida en ` + this.time +` segons</p>`
            : '') + `<button type="button" id="${this.instance}" onclick="onButtonPress(this);">Comprova</button>
            <button type="button" id="refresh${this.instance}" onclick="onRefreshPress(this);">Refer</button>`;
        }

        this.divContainer.innerHTML += '\n<button type=button id="timer' + this.instance + '" onclick="startTimer(this);">Start</button>';

        var p = document.getElementById("enunciat" + this.instance);
        this.power = Math.round(Math.random() * 21) + 3;
        this.resNum = Math.round(Math.random() * 5) + 2;

        if (resOption == 2)
            this.power *= 5;
        else if (resOption == 3)
            this.power *= 10;

        var res = [];

        for (var i = 0; i < this.resNum; i++)
            res.push(Math.round(Math.random() * (maxRes - minRes)) + minRes);
        
        if (this.type == 1)
        {
            p.innerHTML = 'Tenim una font de Vt = ' + this.power + 'V, i les resistències són de';
        
            for (var i = 0; i < this.resNum; i++)
            {
                p.innerHTML += ' R' + i + " = " + res[i] + ' Ohms';
                
                if (i < this.resNum-2)
                    p.innerHTML += ',';
                else if (i == this.resNum-2)
                    p.innerHTML += ' i ';
            }
        }
        
        if (this.type == 1)
            var div = document.getElementById((circuitType == 'serie'? 'voltages' : 'intensities') + this.instance);
        else
            var div = document.getElementById("resistencies" + this.instance);
        
        for (var i = 0; i < this.resNum; i++)
        {
            if (this.type == 1)
            {
                div.innerHTML += '<p><input type="text" id="res' + i + (circuitType == 'serie'? 'Voltage' : 'Intensity') + this.instance
                + `"> ${circuitType == 'serie'? 'Voltatge' : 'Intensitat'} resistència ` + i + (circuitType == 'serie'? ' (V)' : ' (A)') +'</p>';
            }
            else
            {
                div.innerHTML += '<p><input type="text" id="res' + i + this.instance
                + `"> Resistència ` + i + ' (Ohms)' + '</p>';
            }
        }
        
        this.circuit = circuitType == 'serie'? new CircuitSerie(res, this.power) : new CircuitParalel(res, this.power);
        this.circuitType = circuitType;

        const sol = this.circuit.solve();

        if (this.type == 2)
        {
            p.innerHTML = 'Tenim una intensitat de It = ' + sol.intensity.toFixed(5) + 'A, i els voltatges de cada resistència són de';
           
            for (var i = 0; i < this.resNum; i++)
            {
                p.innerHTML += ' V' + i + ' = ' + sol["res" + i + "Voltage"].toFixed(2) + 'V';
                
                if (i < this.resNum-2)
                    p.innerHTML += ',';
                else if (i == this.resNum-2)
                    p.innerHTML += ' i ';
            }
        }
    }

    startTimer()
    {
        var p = document.getElementById("enunciat" + this.instance);
        p.innerHTML += '<br/>Time: 0s';

        setInterval(() => {
            p.innerHTML = p.innerHTML.replace(this.seconds + "s", (this.seconds + 1) + "s");
            this.seconds++;
        }, 1000);
    }

    checkAnswers(ans)
    {
        var numAnsRight = 0;
        var numAnsWrong = 0;
        var res = this.circuit.solve();
        var totalRes = document.getElementById("totalRes" + this.instance);
        var intensity = document.getElementById("intensity" + this.instance);
        var informe = {};

        if (this.type == 1)
        {
            if (isNaN(ans[0]) || (this.circuitType == 'serie' && ans[0] != res["totalRes"]) ||
                (this.circuitType == 'paralel' && Math.abs(ans[0] - res["totalRes"]) > res["totalRes"] * tolerance))
            {
                numAnsWrong++;
                totalRes.style.setProperty("color", "red");
                informe["ResistenciaTotal"] = "malament";
            }
            else
            {
                totalRes.style.setProperty("color", "green");
                numAnsRight++;
                informe["ResistenciaTotal"] = "be";
            }

            if (isNaN(ans[1]) || (Math.abs(ans[1] - res["intensity"]) > res["intensity"] * tolerance))
            {
                numAnsWrong++;
                intensity.style.setProperty("color", "red");
                informe["IntensitatTotal"] = "malament";
            }
            else
            {
                intensity.style.setProperty("color", "green");
                numAnsRight++;
                informe["IntensitatTotal"] = "be";
            }

            var str = this.circuitType == 'serie'? 'Voltage' : 'Intensity';

            for (var i = 0; i < this.resNum; i++)
            {
                if (isNaN(ans[i + 2]) || Math.abs(ans[i + 2] - res["res" + i + str]) > res["res" + i + str] * tolerance)
                {
                    numAnsWrong++;
                    document.getElementById("res" + i + str + this.instance).style.setProperty("color", "red");
                    informe[str + "Resistencia" + i] = "malament";
                }
                else
                {
                    document.getElementById("res" + i + str + this.instance).style.setProperty("color", "green");
                    numAnsRight++;
                    informe[str + "Resistencia" + i] = "be";
                }
            }
        }
        else
        {
            const voltage = document.getElementById("voltage" + this.instance);

            if (isNaN(ans[0]) || Math.abs(ans[0] - res["totalRes"]) > res["totalRes"] * tolerance)
            {
                numAnsWrong++;
                totalRes.style.setProperty("color", "red");
                informe["ResistenciaTotal"] = "malament";
            }
            else
            {
                totalRes.style.setProperty("color", "green");
                numAnsRight++;
                informe["ResistenciaTotal"] = "be";
            }
            
            if (isNaN(ans[1]) || Math.abs(ans[1] - this.circuit.powerFont) > this.circuit.powerFont * tolerance)
            {
                numAnsWrong++;
                voltage.style.setProperty("color", "red");
                informe["VoltatgeTotal"] = "malament";
            }
            else
            {
                voltage.style.setProperty("color", "green");
                numAnsRight++;
                informe["VoltatgeTotal"] = "be";
            }

            for (var i = 0; i < this.resNum; i++)
            {
                if (isNaN(ans[i + 2]) || Math.abs(ans[i + 2] - this.circuit.resistances["res"+i]) > this.circuit.resistances["res"+i] * tolerance)
                {
                    numAnsWrong++;
                    document.getElementById("res" + i + this.instance).style.setProperty("color", "red");
                    informe["Resistencia" + i] = "malament";
                }
                else
                {
                    document.getElementById("res" + i + this.instance).style.setProperty("color", "green");
                    numAnsRight++;
                    informe["Resistencia" + i] = "be"
                }
            }
        }

        if (potenciaEngergia)
        {
            if (isNaN(ans[ans.length - 2]) || Math.abs(ans[ans.length - 2] - res["power"]) > res["power"] * tolerance)
            {
                numAnsWrong++;
                document.getElementById("potencia" + this.instance).style.setProperty("color", "red");
                informe["Potencia"] = "malament";
            }
            else
            {
                numAnsRight++;
                document.getElementById("potencia" + this.instance).style.setProperty("color", "green");
                informe["PotenciaTotal"] = "be";
            }

            if (isNaN(ans[ans.length - 1]) || (Math.abs(ans[ans.length - 1] - res["power"] * this.time) > res["power"] * this.time * tolerance))
            {
                numAnsWrong++;
                document.getElementById("energia" + this.instance).style.setProperty("color", "red");
                informe["Energia"] = "malament";
            }
            else
            {
                numAnsRight++;
                document.getElementById("energia" + this.instance).style.setProperty("color", "green");
                informe["Energia"] = "be"
            }
        }

        informe["RespostesCorrectes"] = numAnsRight;
        informe["RespostesIncorrectes"] = numAnsWrong;

        if (numAnsWrong == 0)
            alert("Tot correcte!");
        else
            alert("Tens " + numAnsWrong + " errors!");

        /* Write to a cookie the number of right and wrong answers */

        var prevAnsRight = readCookie("ansRight");
        var prevAnsWrong = readCookie("ansWrong");

        if (prevAnsRight != null)
            document.cookie = "ansRight=" + (parseInt(prevAnsRight) + numAnsRight) + "; max-age=600000;";
        else
            document.cookie = "ansRight=" + numAnsRight + "; max-age=600000;";
        
        if (prevAnsWrong != null)
            document.cookie = "ansWrong=" + (parseInt(prevAnsWrong) + numAnsWrong) + "; max-age=600000;";
        else
            document.cookie = "ansWrong=" + numAnsWrong + "; max-age=600000;";
    
        informe["Intents"] = this.intents;
        informe["Temps"] = this.seconds;
        
        return informe;
    }

    draw()
    {
        var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("circuitDrawing" + this.instance));
        var context = canvas.getContext("2d");

        if (this.circuitType == 'serie')
        {
            /* Draw power font */

            context.moveTo(0, 70);
            context.lineTo(25, 70);
            context.stroke();

            context.moveTo(5, 80);
            context.lineTo(20, 80);
            context.stroke();

            context.moveTo(12, 70);
            context.lineTo(12, 30);
            context.stroke();

            var x = 12, y = 30;

            /* Draw resistors */

            for (var i = 0; i < this.resNum; i++)
            {
                context.moveTo(x, y);
                x += 20;
                context.lineTo(x, y);
                context.stroke();

                context.strokeRect(x, y - 7, 40, 15);
                context.fillText("R" + i, x + 15, y - 10);
                x += 40;
            }

            context.moveTo(x, y);
            x += 10;
            context.lineTo(x, y);
            context.stroke();

            context.moveTo(x, y);
            y = 95;
            context.lineTo(x, y);
            context.stroke();

            context.moveTo(x, y);
            x = 12;
            context.lineTo(x, y);
            context.stroke();

            context.moveTo(x, y);
            y -= 15;
            context.lineTo(x, y);
            context.stroke();

            context.fillText("Vt", x + 20, y - 5);
        }
        else
        {
            /* Draw power font */

            context.moveTo(0, 50);
            context.lineTo(25, 50);
            context.stroke();

            context.moveTo(5, 60);
            context.lineTo(20, 60);
            context.stroke();

            context.moveTo(12, 50);
            context.lineTo(12, 30);
            context.stroke();

            var x = 20, y = 30;

            /* Draw resistors */

            for (var i = 0; i < this.resNum; i++)
            {
                x += 35;
                context.moveTo(x, y);
                context.lineTo(x, y + 7);
                context.stroke();
            
                context.moveTo(x, y + 37);
                context.lineTo(x, y + 44);
                context.stroke();

                context.strokeRect(x - 7, y + 7, 15, 30);

                context.fillText("R" + i, x + 18, y + 15);

                x += 20;
            }

            x -= 20;
            context.moveTo(x, 30);
            context.lineTo(12, 30);
            context.stroke();

            context.moveTo(x, y + 44);
            context.lineTo(12, y + 44);
            context.stroke();

            context.moveTo(12, y + 44);
            context.lineTo(12, 60);
            context.stroke();

            context.fillText("Vt", 30, y + 27);
        }
    }
}

class ExerciciMixt
{
    constructor(divID, instance = null)
    {
        if (potenciaEngergia)
            this.time = parseInt(Math.random() * 200 + 50);
        
        if (instance == null)
        {
            this.instance = instances;
            instances++;
        }
        else
            this.instance = instance;

        this.divContainer = document.getElementById(divID);
        this.type = 'mixt';
        this.intents = 0;
        this.power = Math.round(Math.random() * 21) + 3;
        this.seconds = 0;

        if (resOption == 2)
            this.power *= 5;
        else if (resOption == 3)
            this.power *= 10;

        this.circuit = new CircuitMixt(this.power);

        this.divContainer.innerHTML = `<p id="enunciat` + this.instance + `"></p>
        <canvas id="circuitDrawing` + this.instance + `" width="500" height="100"></canvas>

        <p><input type="text" id="totalRes` + this.instance + `"> Resistència total (Ohms)</p>
        <p><input type="text" id="intensity` + this.instance + `"> Intensitat total (A)</p>
        
        <div id="voltages` + this.instance + `"></div>`
        + (potenciaEngergia? '<p><input type="text" id="potencia' + this.instance + `"> Potència total (W)</p>
        <p><input type="text" id="energia` + this.instance + `"> Energia (en Joules) consumida en ` + this.time +` segons</p>`
        : '') + `<button type="button" id="${this.instance}" onclick="onButtonPress(this);">Comprova</button>
        <button type="button" id="refresh${this.instance}" onclick="onRefreshPress(this);">Refer</button>`;
    
        this.divContainer.innerHTML += '\n<button type=button id="timer' + this.instance + '" onclick="startTimer(this);">Start</button>';

        var p = document.getElementById("enunciat" + this.instance);
        var div = document.getElementById('voltages' + this.instance);

        p.innerHTML = 'Tenim una font de Vt = ' + this.power + 'V, i les resistències són de';
        
        for (var i = 0; i < this.circuit.resistances.resNum; i++)
        {
            p.innerHTML += ' R' + i + " = " + this.circuit.resistances["res"+i] + ' Ohms';
            
            if (i != this.resNum-1)
                p.innerHTML += ',';
        }

        for (var i = 0; i < this.circuit.resistances.resNum; i++)
        {
            div.innerHTML += '<p><input type="text" id="res' + i + 'Voltage' + this.instance
            + `"> Voltatge resistència ` + i +' (V)</p>';
        }

        this.resNum = this.circuit.resistances.resNum;
    }

    startTimer()
    {
        var p = document.getElementById("enunciat" + this.instance);
        p.innerHTML += '<br/>Time: 0s';

        setInterval(() => {
            p.innerHTML = p.innerHTML.replace(this.seconds + "s", (this.seconds + 1) + "s");
            this.seconds++;
        }, 1000);
    }

    checkAnswers(ans)
    {
        var numAnsRight = 0;
        var numAnsWrong = 0;
        var res = this.circuit.solve();
        var totalRes = document.getElementById("totalRes" + this.instance);
        var intensity = document.getElementById("intensity" + this.instance);
        var informe = {};
        
        if (isNaN(ans[0]) || Math.abs(ans[0] - res["totalRes"]) > res["totalRes"] * tolerance)
        {
            numAnsWrong++;
            informe["ResistenciaTotal"] = 'malament';
            totalRes.style.setProperty("color", "red");
        }
        else
        {
            totalRes.style.setProperty("color", "green");
            numAnsRight++;
            informe["ResistenciaTotal"] = 'be';
        }

        if (isNaN(ans[1]) || (Math.abs(ans[1] - res["intensity"]) > res["intensity"] * tolerance))
        {
            numAnsWrong++;
            intensity.style.setProperty("color", "red");
            informe["IntensitatTotal"] = 'malament';
        }
        else
        {
            intensity.style.setProperty("color", "green");
            numAnsRight++;
            informe["IntensitatTotal"] = 'be';
        }

        var str = 'Voltage';

        for (var i = 0; i < this.resNum; i++)
        {
            if (isNaN(ans[i + 2]) || Math.abs(ans[i + 2] - res["res" + i + str]) > res["res" + i + str] * tolerance)
            {
                numAnsWrong++;
                document.getElementById("res" + i + str + this.instance).style.setProperty("color", "red");
            
                informe[str + "Resistencia" + i] = "malament";
            }
            else
            {
                document.getElementById("res" + i + str + this.instance).style.setProperty("color", "green");
                numAnsRight++;
                informe[str + "Resistencia" + i] = "be";
            }
        }

        if (potenciaEngergia)
        {
            if (isNaN(ans[ans.length - 2]) || (Math.abs(ans[ans.length - 2] - res["power"]) > res["power"] * tolerance))
            {
                numAnsWrong++;
                document.getElementById("potencia" + this.instance).style.setProperty("color", "red");
                informe["Potencia"] = "malament";
            }
            else
            {
                numAnsRight++;
                document.getElementById("potencia" + this.instance).style.setProperty("color", "green");
                informe["Potencia"] = "be";
            }

            if (isNaN(ans[ans.length - 1]) || (Math.abs(ans[ans.length - 1] - res["power"] * this.time) > res["power"] * this.time * tolerance))
            {
                numAnsWrong++;
                document.getElementById("energia" + this.instance).style.setProperty("color", "red");
                informe["Energia"] = "malament";
            }
            else
            {
                numAnsRight++;
                document.getElementById("energia" + this.instance).style.setProperty("color", "green");
                informe["Energia"] = "be";
            }
        }

        informe["RespostesCorrectes"] = numAnsRight;
        informe["RespostesIncorrectes"] = numAnsWrong;

        if (numAnsWrong == 0)
            alert("Tot correcte!");
        else
            alert("Tens " + numAnsWrong + " errors!");

        /* Write to a cookie the number of right and wrong answers */

        var prevAnsRight = readCookie("ansRight");
        var prevAnsWrong = readCookie("ansWrong");

        if (prevAnsRight != null)
            document.cookie = "ansRight=" + (parseInt(prevAnsRight) + numAnsRight) + "; max-age=600000;";
        else
            document.cookie = "ansRight=" + numAnsRight + "; max-age=600000;";
        
        if (prevAnsWrong != null)
            document.cookie = "ansWrong=" + (parseInt(prevAnsWrong) + numAnsWrong) + "; max-age=600000;";
        else
            document.cookie = "ansWrong=" + numAnsWrong + "; max-age=600000;";

        informe["Intents"] = this.intents;
        informe["Temps"] = this.seconds;
        
        return informe;
    }

    draw()
    {
        var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("circuitDrawing" + this.instance));
        var context = canvas.getContext("2d");
        var currentNode = this.circuit.initialNode;

        /* Draw power font */

        context.moveTo(0, 50);
        context.lineTo(25, 50);
        context.stroke();

        context.moveTo(5, 60);
        context.lineTo(20, 60);
        context.stroke();

        context.moveTo(12, 50);
        context.lineTo(12, 30);
        context.stroke();

        context.moveTo(12, 30);
        context.lineTo(22, 30);
        context.stroke();

        context.fillText("Vt", 28, 65);

        var x = 22, y = 30;

        do
        {
            if (currentNode.nextNode2 == null)
            {
                /* Just draw a resistance */

                context.moveTo(x, y);
                x += 20;
                context.lineTo(x, y);
                context.stroke();

                context.strokeRect(x, y - 7, 40, 15);
                context.fillText("R" + getKeyByValue(this.circuit.resistances,
                    currentNode.nextNode1.resValue).replace("res", ""), x + 15, y + 20);
                
                x += 40;
                currentNode = currentNode.nextNode1;
            }
            else
            {
                context.moveTo(x, y);
                x += 20;
                context.lineTo(x, y);
                context.stroke();

                var a = this.drawBranch(context, currentNode.nextNode1, true, x, y);
                var b = this.drawBranch(context, currentNode.nextNode2, false, x, y);

                currentNode = a[0];

                if (a[1] > b[1])
                    x = a[1]
                else
                    x = b[1];
                
                x += 20;
                
                context.moveTo(a[1], y - 20);
                context.lineTo(x, y - 20);
                context.stroke();

                context.moveTo(b[1], y + 20);
                context.lineTo(x, y + 20);
                context.stroke();

                context.moveTo(x, y - 20);
                context.lineTo(x, y + 20);
                context.stroke();
            }

        } while (currentNode.nextNode1 != this.circuit.initialNode);

        context.moveTo(x, y);
        x += 20;
        context.lineTo(x, y);
        context.stroke();

        context.moveTo(x, y);
        context.lineTo(x, 80);
        context.stroke();

        context.moveTo(x, 80);
        context.lineTo(12, 80);
        context.stroke();
        
        context.moveTo(12, 80);
        context.lineTo(12, 60);
        context.stroke();
    }

    drawBranch(context, node, up, x, y)
    {
        context.moveTo(x, y);

        if (up)
            y -= 20;
        else
            y += 20;

        context.lineTo(x, y);
        context.stroke();

        while (node.nodeType != CircuitMixt.NodeType.UNION)
        {
            context.moveTo(x, y);
            x += 20;
            context.lineTo(x, y);
            context.stroke();

            context.strokeRect(x, y - 7, 40, 15);

            context.fillText("R" + getKeyByValue(this.circuit.resistances,
                node.resValue).replace("res", ""), x + 15, y + 20);

            x += 40;
            node = node.nextNode1;
        }

        return [node, x];
    }
}

function getKeyByValue(object, value)
{
    return Object.keys(object).find(key => object[key] === value);
}
