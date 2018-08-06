/* Base class of the circuit */

class Circuit
{
    constructor(resValues, powerFont)
    {
        this.powerFont = powerFont;

        this.resistances = {
            'resNum': resValues.length
        };

        for (var i = 0; i < resValues.length; i++)
            this.resistances["res" + i] = resValues[i];
    }
}


class CircuitSerie extends Circuit
{
    constructor(resValues, powerFont)
    {
        super(resValues, powerFont);
    }

    solve()
    {
        var ans = {};
        var totalRes = 0;

        for (var i = 0; i < this.resistances.resNum; i++)
            totalRes += this.resistances["res" + i];

        var intensity = this.powerFont / totalRes;

        ans["totalRes"] = totalRes;
        ans["intensity"] = intensity;
        
        for (var i = 0; i < this.resistances.resNum; i++)
            ans["res" + i + "Voltage"] = this.resistances["res" + i] * intensity;
        
        ans["power"] = this.powerFont * intensity;

        return ans;
    }
}


class CircuitParalel extends Circuit
{
    constructor(resValues, powerFont)
    {
        super(resValues, powerFont);
    }

    solve()
    {
        var ans = {};
        var totalRes = 0;

        for (var i = 0; i < this.resistances.resNum; i++)
            totalRes += 1 / this.resistances["res" + i];

        totalRes = 1 / totalRes;
        var intensity = this.powerFont / totalRes;

        ans["totalRes"] = totalRes;
        ans["intensity"] = intensity;

        for (var i = 0; i < this.resistances.resNum; i++)
            ans["res" + i + "Intensity"] = this.powerFont / this.resistances["res" + i];
        
        ans["power"] = this.powerFont * intensity;
        
        return ans;
    }
}


class CircuitMixt extends Circuit
{
    static get NodeType()
    {
        return {
            INITIAL: 0,
            UNION: 1,
            RESISTOR: 2
        }
    }

    static get Node()
    {
        return class
        {
            constructor(nodeType, nextNode1 = null, nextNode2 = null)
            {
                this.nodeType = nodeType;
                this.nextNode1 = nextNode1;
                this.nextNode2 = nextNode2;
            }
        }
    }

    static get Resistor()
    {
        return class extends CircuitMixt.Node
        {
            constructor(resValue)
            {
                super(CircuitMixt.NodeType.RESISTOR);
                this.resValue = resValue;
                this.voltage = null;
                this.intensity = null;
            }
        }
    }

    static get PairResistor()
    {
        return class extends CircuitMixt.Resistor {

            constructor(resValue1, resValue2, serie)
            {
                if (serie == true)
                {
                    super(resValue1.resValue + resValue2.resValue);
                    this.type = "serie";
                }
                else
                {
                    super(1 / (1/resValue1.resValue + 1/resValue2.resValue));
                    this.type = "paralel";
                }

                this.res1 = resValue1;
                this.res2 = resValue2;
            }
        }
    }

    constructor(powerFont)
    {
        super([], powerFont);
        this.createCircuit();
    }

    createCircuit()
    {
        this.paralelBranch = false;
        this.initialNode = new CircuitMixt.Node(CircuitMixt.NodeType.INITIAL);
        this.iterate(this.initialNode);
    }

    iterate(currentNode, paralelNum = 0, unionNode = null)
    {
        if (paralelNum == 2)
        {
            currentNode.nextNode1 = this.initialNode;
            return;
        }

        if (unionNode == null)
        {
            if (Math.random() > 0.5 || (!this.paralelBranch && paralelNum > 0))
            {
                /* Two paralel resistors */
                this.paralelBranch = true;

                var r = new CircuitMixt.Resistor(Math.round(Math.random() * (maxRes - minRes)) + minRes);
                this.resistances["res" + this.resistances.resNum] = r.resValue;
                this.resistances.resNum++;
                currentNode.nextNode1 = r;

                var r2 = new CircuitMixt.Resistor(Math.round(Math.random() * (maxRes - minRes)) + minRes);
                this.resistances["res" + this.resistances.resNum] = r2.resValue;
                this.resistances.resNum++;
                currentNode.nextNode2 = r2;

                var unionNode = new CircuitMixt.Node(CircuitMixt.NodeType.UNION);

                this.iterate(currentNode.nextNode1, paralelNum, unionNode);
                this.iterate(currentNode.nextNode2, paralelNum, unionNode);

                this.iterate(unionNode, paralelNum + 1);
            }
            else
            {
                /* One resistor */

                var r = new CircuitMixt.Resistor(Math.round(Math.random() * (maxRes - minRes)) + minRes);
                this.resistances["res" + this.resistances.resNum] = r.resValue;
                this.resistances.resNum++;
                currentNode.nextNode1 = r;

                this.iterate(currentNode.nextNode1, paralelNum + 1);
            }
        }
        else
        {
            if (Math.random() > 0.5)
            {
                /* Add another resistor */

                var r = new CircuitMixt.Resistor(Math.round(Math.random() * (maxRes - minRes)) + minRes);
                this.resistances["res" + this.resistances.resNum] = r.resValue;
                this.resistances.resNum++;
                currentNode.nextNode1 = r;
                currentNode.nextNode1.nextNode1 = unionNode;
            }
            else
            {
                /* Just one resistor */

                currentNode.nextNode1 = unionNode;
            }
        }
    }

    solve()
    {
        var ans = {};
        var totalRes = 0;

        var newInitialNode = this.createSimpleCircuit();

        totalRes = newInitialNode.nextNode1.resValue;
        var intensity = this.powerFont / totalRes;

        ans["totalRes"] = totalRes;
        ans["intensity"] = intensity;
        ans["power"] = this.powerFont * intensity;

        newInitialNode.nextNode1.voltage = this.powerFont;
        newInitialNode.nextNode1.intensity = intensity;

        /* Voltages and intensities of resistors */
        this.calculateVoltageIntensity(newInitialNode.nextNode1, ans);
        
        return ans;
    }

    calculateVoltageIntensity(res, ans)
    {
        if (res.res1 == undefined || res.res2 == undefined)
        {
            ans[getKeyByValue(this.resistances, res.resValue) + "Voltage"] = res.voltage;
            ans[getKeyByValue(this.resistances, res.resValue) + "Intensity"] = res.intensity;
            
            return;
        }

        if (res.type == "serie")
        {
            res.res1.voltage = res.voltage * res.res1.resValue / res.resValue;
            res.res2.voltage = res.voltage * res.res2.resValue / res.resValue;

            res.res1.intensity = res.intensity;
            res.res2.intensity = res.intensity;
        }
        else
        {
            res.res1.voltage = res.voltage;
            res.res2.voltage = res.voltage;

            res.res1.intensity = res.voltage / res.res1.resValue;
            res.res2.intensity = res.voltage / res.res2.resValue;
        }

        this.calculateVoltageIntensity(res.res1, ans);
        this.calculateVoltageIntensity(res.res2, ans);
    }

    createSimpleCircuit()
    {
        var newInitialNode = new CircuitMixt.Node(CircuitMixt.NodeType.INITIAL);
        var unionNode = this.initialNode.nextNode1;

        if (this.initialNode.nextNode2 != null)
        {
            while (unionNode.nodeType != CircuitMixt.NodeType.UNION)
                unionNode = unionNode.nextNode1;
        }
        else
            unionNode = this.initialNode.nextNode1;
        
        if (this.initialNode.nextNode1.nextNode1.nodeType == CircuitMixt.NodeType.RESISTOR && this.initialNode.nextNode2 != null)
            newInitialNode.nextNode1 = new CircuitMixt.PairResistor(this.initialNode.nextNode1, this.initialNode.nextNode1.nextNode1, true);
        else
            newInitialNode.nextNode1 = new CircuitMixt.Resistor(this.initialNode.nextNode1.resValue);

        newInitialNode.nextNode1.nextNode1 = new CircuitMixt.Node(CircuitMixt.NodeType.UNION);
        var newUnionNode = newInitialNode.nextNode1.nextNode1;

        if (this.initialNode.nextNode2 != null)
        {
            if (this.initialNode.nextNode2.nextNode1.nodeType == CircuitMixt.NodeType.RESISTOR)
                newInitialNode.nextNode2 = new CircuitMixt.PairResistor(this.initialNode.nextNode2, this.initialNode.nextNode2.nextNode1, true);
            else
                newInitialNode.nextNode2 = new CircuitMixt.Resistor(this.initialNode.nextNode2.resValue);
        
            newInitialNode.nextNode2.nextNode1 = newUnionNode;
        }

        if (unionNode.nextNode1.nextNode1.nodeType == CircuitMixt.NodeType.RESISTOR && unionNode.nextNode2 != null)
            newUnionNode.nextNode1 = new CircuitMixt.PairResistor(unionNode.nextNode1, unionNode.nextNode1.nextNode1, true);
        else
            newUnionNode.nextNode1 = new CircuitMixt.Resistor(unionNode.nextNode1.resValue);
        
        newUnionNode.nextNode1.nextNode1 = newInitialNode;

        if (unionNode.nextNode2 != null)
        {
            if (unionNode.nextNode2.nextNode1.nodeType == CircuitMixt.NodeType.RESISTOR)
                newUnionNode.nextNode2 = new CircuitMixt.PairResistor(unionNode.nextNode2, unionNode.nextNode2.nextNode1, true);
            else
                newUnionNode.nextNode2 = new CircuitMixt.Resistor(unionNode.nextNode2.resValue);
            
            newUnionNode.nextNode2.nextNode1 = newInitialNode;
        }

        if (newInitialNode.nextNode2 != null)
        {
            newInitialNode.nextNode1 = new CircuitMixt.PairResistor(newInitialNode.nextNode1, newInitialNode.nextNode2, false);
            newInitialNode.nextNode1.nextNode1 = newUnionNode;
            newInitialNode.nextNode2 = null;
        }
        if (newUnionNode.nextNode2 != null)
        {
            newUnionNode.nextNode1 = new CircuitMixt.PairResistor(newUnionNode.nextNode1, newUnionNode.nextNode2, false);
            newUnionNode.nextNode1.nextNode1 = newInitialNode;
            newUnionNode.nextNode2 = null;
        }

        newInitialNode.nextNode1 = new CircuitMixt.PairResistor(newInitialNode.nextNode1, newUnionNode.nextNode1, true);
        newInitialNode.nextNode1.nextNode1 = newInitialNode;

        return newInitialNode;
    }
}


function readCookie(name)
{
    var nameEQ = name + "="; 
    var ca = document.cookie.split(';');
  
    for(var i = 0; i < ca.length; i++)
    {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);

      if (c.indexOf(nameEQ) == 0)
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  
    return null;
}
