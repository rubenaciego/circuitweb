
window.onload = function() {

    var selected = false;

    for (var i = 1; i <= 3; i++)
    {
        if (document.getElementById("radio" + i).checked)
        {
            selected = true;
            break;
        }
    }

    if (!selected)
        document.getElementById("radio1").checked = true;
};

function loadPage(input)
{
    var form = document.getElementById("myForm");
    var potencia = document.getElementById("potencia");
    var name = input.innerHTML;
    var formResistencies = document.getElementById("formResistencies");
    
    if (potencia.checked)
        document.getElementById("formPotencia").value = "true";
    else 
        document.getElementById("formPotencia").value = "false";

    formResistencies.value = "null";

    for (var i = 1; i <= 3; i++)
    {
        if (document.getElementById("radio" + i).checked)
        {
            formResistencies.value = i.toString();
            break;
        }
    }

    switch (name)
    {
        case "Circuits sèrie":
            document.getElementById("formCircuit").value = "serie";
            break;
        case "Circuits paral·lel":
            document.getElementById("formCircuit").value = "paralel";
            break;
        case "Circuits mixtos":
            document.getElementById("formCircuit").value = "mixt";
            break;
        case "Aleatori":
            document.getElementById("formCircuit").value = "aleatori";
            break;
    }

    form.submit();
}
