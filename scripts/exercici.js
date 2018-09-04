
const tolerance = 0.02;

class Exercici
{
    constructor(divID, circuitType, type)
    {
        if (circuitType != 'serie' && circuitType != 'paralel')
            return;

        if (circuitType == 'paralel')
            type = 1;
        
        if (potenciaEngergia)
            this.time = parseInt(Math.random() * 200 + 50);

        this.divContainer = document.getElementById(divID);
        this.type = type;
        this.seconds = 0;

        this.power = Math.round(Math.random() * 21) + 3;
        this.resNum = Math.round(Math.random() * 5) + 2;

        if (resOption == 2)
            this.power *= 5;
        else if (resOption == 3)
            this.power *= 10;

        var res = [];

        for (var i = 0; i < this.resNum; i++)
            res.push(Math.round(Math.random() * (maxRes - minRes)) + minRes);

        this.divContainer.innerHTML = `<div class="divEnunciat">
        <canvas class="drawing" id="circuitDrawing" width="450" height="100"></canvas>
        <p class="enunciat" id="enunciat"></p></div><div id="buttonDiv"></div>`;
    
        this.buttonDiv = document.getElementById("buttonDiv");
        this.buttonDiv.innerHTML += '<button style="margin: 10px;" type=button id="timer" onclick="startTimer(this);">Començar</button>';
        
        if (!circuitChanged)
            this.buttonDiv.innerHTML += '<button style="margin: 10px;" type=button id="changeCircuit" onclick="circuitChanged = true; nextExercise();">Canvia circuit</button>';
        
        this.circuit = circuitType == 'serie'? new CircuitSerie(res, this.power) : new CircuitParalel(res, this.power);
        this.circuitType = circuitType;
        
        this.res = res;

        this.resNum = this.circuit.resistances.resNum;

        var canvas = document.getElementById("circuitDrawing");
        this.canvasWidth = canvas.style.width;
        canvas.style.width = "80%";
    }

    showExercise()
    {
        var canvas = document.getElementById("circuitDrawing");
        canvas.style.width = this.canvasWidth;
        this.buttonDiv.innerHTML = "";
        var res = this.res;

        if (this.type == 1)
        {
            this.divContainer.innerHTML += `<div><div class="inputDiv">
            <p><input type="text" id="totalRes"> Resistència total (Ohms)</p>
            <p><input type="text" id="intensity"> Intensitat total (A)</p>
            
            <div id="${this.circuitType == 'serie'? 'voltages' : 'intensities'}"></div>`
            + (potenciaEngergia? '<p><input type="text" id="potencia"> Potència total (W)</p>' + `
            <p><input type="text" id="energia"> Energia (en Joules) consumida en ` + this.time +` segons</p>`
            : '') + `</div>
            <div id="ans">
            <button type="button" onclick="onButtonPress(this);">Comprova</button>
            </div></div>`;
        }
        else
        {
            this.divContainer.innerHTML += `<div><div class="inputDiv">
            <p><input type="text" id="totalRes"> Resistència total (Ohms)</p>
            <p><input type="text" id="voltage"> Voltatge total (V)</p>
            
            <div id="resistencies"></div>`
            + (potenciaEngergia? '<p><input type="text" id="potencia' + `"> Potència total (W)</p>
            <p><input type="text" id="energia"> Energia (en Joules) consumida en ` + this.time +` segons</p>`
            : '') + `</div>
            <div id="ans">            
            <button type="button"onclick="onButtonPress(this);">Comprova</button>
            </div></div>`;
        }

        var p = document.getElementById("enunciat");

        if (this.type == 1)
        {
            p.innerHTML = 'Tenim una font de Vt = ' + this.power + 'V, i les resistències són de';
        
            for (var i = 0; i < this.resNum; i++)
                p.innerHTML += '<br> R' + i + " = " + res[i] + ' Ohms';
        }
        
        if (this.type == 1)
            var div = document.getElementById((this.circuitType == 'serie'? 'voltages' : 'intensities'));
        else
            var div = document.getElementById("resistencies");
        
        for (var i = 0; i < this.resNum; i++)
        {
            if (this.type == 1)
            {
                div.innerHTML += '<p><input type="text" id="res' + i + (this.circuitType == 'serie'? 'Voltage' : 'Intensity')
                + `"> ${this.circuitType == 'serie'? 'Voltatge' : 'Intensitat'} resistència ` + i + (this.circuitType == 'serie'? ' (V)' : ' (A)') +'</p>';
            }
            else
            {
                div.innerHTML += '<p><input type="text" id="res' + i
                + `"> Resistència ` + i + ' (Ohms)' + '</p>';
            }
        }

        const sol = this.circuit.solve();

        if (this.type == 2)
        {
            p.innerHTML = 'Tenim una intensitat de It = ' + sol.intensity.toFixed(5) + 'A, i els voltatges de cada resistència són de';
           
            for (var i = 0; i < this.resNum; i++)
                p.innerHTML += '<br> V' + i + ' = ' + sol["res" + i + "Voltage"].toFixed(2) + 'V';
        }
    }

    startTimer()
    {
        var p = document.getElementById("enunciat");
        p.innerHTML += '<br/>Time: 0s';

        this.timerHandle = setInterval(() => {
            p.innerHTML = p.innerHTML.replace(this.seconds + "s", (this.seconds + 1) + "s");
            this.seconds++;
        }, 1000);
    }

    checkAnswers(ans)
    {
        var numAnsRight = 0;
        var numAnsWrong = 0;
        var res = this.circuit.solve();
        var totalRes = document.getElementById("totalRes");
        var intensity = document.getElementById("intensity");
        var informe = {};

        if (this.type == 1)
        {
            if (isNaN(ans[0]) || (this.circuitType == 'serie' && ans[0] != res["totalRes"]) ||
                (this.circuitType == 'paralel' && Math.abs(ans[0] - res["totalRes"]) > res["totalRes"] * tolerance))
            {
                numAnsWrong++;
                totalRes.style.setProperty("color", "red");
                informe["Rt"] = "n";
            }
            else
            {
                totalRes.style.setProperty("color", "green");
                numAnsRight++;
                informe["Rt"] = "y";
            }

            if (isNaN(ans[1]) || (Math.abs(ans[1] - res["intensity"]) > res["intensity"] * tolerance))
            {
                numAnsWrong++;
                intensity.style.setProperty("color", "red");
                informe["It"] = "n";
            }
            else
            {
                intensity.style.setProperty("color", "green");
                numAnsRight++;
                informe["It"] = "y";
            }

            var str = this.circuitType == 'serie'? 'Voltage' : 'Intensity';

            for (var i = 0; i < this.resNum; i++)
            {
                if (isNaN(ans[i + 2]) || Math.abs(ans[i + 2] - res["res" + i + str]) > res["res" + i + str] * tolerance)
                {
                    numAnsWrong++;
                    document.getElementById("res" + i + str).style.setProperty("color", "red");
                    informe[str + "R" + i] = "n";
                }
                else
                {
                    document.getElementById("res" + i + str).style.setProperty("color", "green");
                    numAnsRight++;
                    informe[str + "R" + i] = "y";
                }
            }
        }
        else
        {
            const voltage = document.getElementById("voltage");

            if (isNaN(ans[0]) || Math.abs(ans[0] - res["totalRes"]) > res["totalRes"] * tolerance)
            {
                numAnsWrong++;
                totalRes.style.setProperty("color", "red");
                informe["Rt"] = "n";
            }
            else
            {
                totalRes.style.setProperty("color", "green");
                numAnsRight++;
                informe["Rt"] = "y";
            }
            
            if (isNaN(ans[1]) || Math.abs(ans[1] - this.circuit.powerFont) > this.circuit.powerFont * tolerance)
            {
                numAnsWrong++;
                voltage.style.setProperty("color", "red");
                informe["Vt"] = "n";
            }
            else
            {
                voltage.style.setProperty("color", "green");
                numAnsRight++;
                informe["Vt"] = "y";
            }

            for (var i = 0; i < this.resNum; i++)
            {
                if (isNaN(ans[i + 2]) || Math.abs(ans[i + 2] - this.circuit.resistances["res"+i]) > this.circuit.resistances["res"+i] * tolerance)
                {
                    numAnsWrong++;
                    document.getElementById("res" + i).style.setProperty("color", "red");
                    informe["R" + i] = "n";
                }
                else
                {
                    document.getElementById("res" + i).style.setProperty("color", "green");
                    numAnsRight++;
                    informe["R" + i] = "y"
                }
            }
        }

        if (potenciaEngergia)
        {
            if (isNaN(ans[ans.length - 2]) || Math.abs(ans[ans.length - 2] - res["power"]) > res["power"] * tolerance)
            {
                numAnsWrong++;
                document.getElementById("potencia").style.setProperty("color", "red");
                informe["Pt"] = "n";
            }
            else
            {
                numAnsRight++;
                document.getElementById("potencia").style.setProperty("color", "green");
                informe["Pt"] = "y";
            }

            if (isNaN(ans[ans.length - 1]) || (Math.abs(ans[ans.length - 1] - res["power"] * this.time) > res["power"] * this.time * tolerance))
            {
                numAnsWrong++;
                document.getElementById("energia").style.setProperty("color", "red");
                informe["E"] = "n";
            }
            else
            {
                numAnsRight++;
                document.getElementById("energia").style.setProperty("color", "green");
                informe["E"] = "y"
            }
        }

        informe["RespostesCorrectes"] = numAnsRight;
        informe["RespostesIncorrectes"] = numAnsWrong;

        var str = "";

        if (numAnsWrong == 0)
            str = "Tot correcte!";
        else
            str = "Tens " + numAnsWrong + " errors!";
        
        var div = document.getElementById("ans");
        div.innerHTML = '<p>' + str + '</p>' + div.innerHTML.replace("Comprova", "Següent");
        informe["Temps"] = this.seconds;
        
        return informe;
    }

    draw()
    {
        var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("circuitDrawing"));
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
    constructor(divID)
    {
        if (potenciaEngergia)
            this.time = parseInt(Math.random() * 200 + 50);

        this.divContainer = document.getElementById(divID);
        this.type = 'mixt';
        this.power = Math.round(Math.random() * 21) + 3;
        this.seconds = 0;

        if (resOption == 2)
            this.power *= 5;
        else if (resOption == 3)
            this.power *= 10;

        this.circuit = new CircuitMixt(this.power);

        this.divContainer.innerHTML = `<div class="divEnunciat">
        <canvas class="drawing" id="circuitDrawing" width="375" height="100"></canvas>
        <p class="enunciat" id="enunciat"></p></div><div id="buttonDiv"></div>`;
    
        this.buttonDiv = document.getElementById("buttonDiv");
        this.buttonDiv.innerHTML += '<button style="margin: 10px;" type=button id="timer" onclick="startTimer(this);">Començar</button>';
        
        if (!circuitChanged)
            this.buttonDiv.innerHTML += '<button style="margin: 10px;" type=button id="changeCircuit" onclick="circuitChanged = true; nextExercise();">Canvia circuit</button>';
        
        this.resNum = this.circuit.resistances.resNum;

        var canvas = document.getElementById("circuitDrawing");
        this.canvasWidth = canvas.style.width;
        canvas.style.width = "80%";
    }

    showExercise()
    {
        var canvas = document.getElementById("circuitDrawing");
        canvas.style.width = this.canvasWidth;
        this.buttonDiv.innerHTML = "";
        this.divContainer.innerHTML += `<div><div class="inputDiv">

        <p><input type="text" id="totalRes"> Resistència total (Ohms)</p>
        <p><input type="text" id="intensity"> Intensitat total (A)</p>
        
        <div id="voltages"></div>`
        + (potenciaEngergia? `<p><input type="text" id="potencia"> Potència total (W)</p>
        <p><input type="text" id="energia"> Energia (en Joules) consumida en ` + this.time +` segons</p>`
        : '') + `</div>
        <div id="ans">
        <button type="button" onclick="onButtonPress(this);">Comprova</button>
        </div></div>`;

        var p = document.getElementById("enunciat");
        var div = document.getElementById("voltages");

        p.innerHTML = 'Tenim una font de Vt = ' + this.power + 'V, i les resistències són de';
        
        for (var i = 0; i < this.circuit.resistances.resNum; i++)
        {
            p.innerHTML += '</br> R' + i + " = " + this.circuit.resistances["res"+i] + ' Ohms';
            div.innerHTML += '<p><input type="text" id="res' + i + 'Voltage'
            + `"> Voltatge resistència ` + i +' (V)</p>';
        }
    }

    startTimer()
    {
        var p = document.getElementById("enunciat");
        p.innerHTML += '<br/>Time: 0s';

        this.timerHandle = setInterval(() => {
            p.innerHTML = p.innerHTML.replace(this.seconds + "s", (this.seconds + 1) + "s");
            this.seconds++;
        }, 1000);
    }

    checkAnswers(ans)
    {
        var numAnsRight = 0;
        var numAnsWrong = 0;
        var res = this.circuit.solve();
        var totalRes = document.getElementById("totalRes");
        var intensity = document.getElementById("intensity");
        var informe = {};
        
        if (isNaN(ans[0]) || Math.abs(ans[0] - res["totalRes"]) > res["totalRes"] * tolerance)
        {
            numAnsWrong++;
            informe["Rt"] = 'n';
            totalRes.style.setProperty("color", "red");
        }
        else
        {
            totalRes.style.setProperty("color", "green");
            numAnsRight++;
            informe["Rt"] = 'y';
        }

        if (isNaN(ans[1]) || (Math.abs(ans[1] - res["intensity"]) > res["intensity"] * tolerance))
        {
            numAnsWrong++;
            intensity.style.setProperty("color", "red");
            informe["It"] = 'n';
        }
        else
        {
            intensity.style.setProperty("color", "green");
            numAnsRight++;
            informe["It"] = 'y';
        }

        var str = 'Voltage';

        for (var i = 0; i < this.resNum; i++)
        {
            if (isNaN(ans[i + 2]) || Math.abs(ans[i + 2] - res["res" + i + str]) > res["res" + i + str] * tolerance)
            {
                numAnsWrong++;
                document.getElementById("res" + i + str).style.setProperty("color", "red");
            
                informe[str + "R" + i] = "n";
            }
            else
            {
                document.getElementById("res" + i + str).style.setProperty("color", "green");
                numAnsRight++;
                informe[str + "R" + i] = "y";
            }
        }

        if (potenciaEngergia)
        {
            if (isNaN(ans[ans.length - 2]) || (Math.abs(ans[ans.length - 2] - res["power"]) > res["power"] * tolerance))
            {
                numAnsWrong++;
                document.getElementById("potencia").style.setProperty("color", "red");
                informe["Potencia"] = "n";
            }
            else
            {
                numAnsRight++;
                document.getElementById("potencia").style.setProperty("color", "green");
                informe["Potencia"] = "y";
            }

            if (isNaN(ans[ans.length - 1]) || (Math.abs(ans[ans.length - 1] - res["power"] * this.time) > res["power"] * this.time * tolerance))
            {
                numAnsWrong++;
                document.getElementById("energia").style.setProperty("color", "red");
                informe["Energia"] = "n";
            }
            else
            {
                numAnsRight++;
                document.getElementById("energia").style.setProperty("color", "green");
                informe["Energia"] = "y";
            }
        }

        informe["RespostesCorrectes"] = numAnsRight;
        informe["RespostesIncorrectes"] = numAnsWrong;

        var str = "";

        if (numAnsWrong == 0)
            str = "Tot correcte!";
        else
            str = "Tens " + numAnsWrong + " errors!";

        var div = document.getElementById("ans");

        div.innerHTML = '<p>' + str + '</p>' + div.innerHTML.replace("Comprova", "Següent");
        informe["Temps"] = this.seconds;
        
        return informe;
    }

    draw()
    {
        var canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("circuitDrawing"));
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
