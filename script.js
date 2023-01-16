
var lower_limit = {
    "theta" : 0,      // Rate of new borns infected with HIV
    "epsilon" : 0,    // Fraction of new borns infected with HIV who dies immediately after birth
    "v" : 0,          // Rate of movement from Aids to Treated class
    "beta1" : 0,      // Sexual contact rate in Infected class
    "beta3" : 0,      // Sexual contact rate in Treated class
    "sigma1" : 0,     // Fraction of (δ) joining Pre-Aids class
    "sigma2" : 0,     // Fraction of (δ) joining Treated class
    "k" : 0,          // Rate of movement from Treated class to Aids class
    "gamma" : 0,      // Rate of movement from Pre-Aids class
    "c1" : 0,         // Average number of sexual partners per unit time in Infected class
    "c3" : 0,         // Average number of sexual partners per unit time in Treated class
    "m" : 0,          // Fraction of (γ) joining Treated class
    "pi" : 0,         // Birth rate
    "delta" : 0,      // Rate of movement from Infectious class (1/how long will be in infection class)
    "alpha" : 0       // Disease induced death rate in Aids patients
}

var upper_limit = {
    "theta" : 1,
    "epsilon" : 1,
    "v" : 1,
    "beta1" : 1,
    "beta3" : 1,
    "sigma1" : 1,
    "sigma2" : 1,
    "k" : 1,
    "gamma" : 1 ,
    "c1" : 10,
    "c3" : 10,
    "m" : 1,
    "pi" : 1,
    "delta" : 1,
    "alpha" : 1
}

// var upper_limit = {
//     "theta" : 0.05,
//     "epsilon" : 1,
//     "v" : 1,
//     "beta1" : 0.1,
//     "beta3" : 0.1,
//     "sigma1" : 0.1,
//     "sigma2" : 0.1,
//     "k" : 1,
//     "gamma" : 1 ,
//     "c1" : 10,
//     "c3" : 10,
//     "m" : 1,
//     "pi" : 1,
//     "delta" : 0.1,
//     "alpha" : 1
// }



function updateInput(max_length) {
    validate();
    var option = document.getElementById("varying_parameter");

    if(option.value == "attractor_plot") {
        for(var i=1; i <= max_length; i++) {
            document.getElementById("add-input-" + i).style.display = "inline";
            if(i%2==1)
                document.getElementById("add-input-" + i).classList.add("border-attractor-blue");
            else
                document.getElementById("add-input-" + i).classList.add("border-attractor-green");
        }
        document.getElementById("susceptible").classList.add("border-attractor-red");
        document.getElementById("infected").classList.add("border-attractor-red");
        document.getElementById("pre-aids").classList.add("border-attractor-red");
        document.getElementById("treated").classList.add("border-attractor-red");
        document.getElementById("aids").classList.add("border-attractor-red");

        document.getElementById("options-input").style.display = "none";
    }

    else if(option.value == "no_variation") {
        for(var i=1; i <= max_length; i++) {
            document.getElementById("add-input-" + i).style.display = "none";
        }
        document.getElementById("susceptible").classList.remove("border-attractor-red");
        document.getElementById("infected").classList.remove("border-attractor-red");
        document.getElementById("pre-aids").classList.remove("border-attractor-red");
        document.getElementById("treated").classList.remove("border-attractor-red");
        document.getElementById("aids").classList.remove("border-attractor-red");

        document.getElementById("options-input").style.display = "none";
    }

    else{
        for(var i=1; i <= max_length; i++) {
            document.getElementById("add-input-" + i).style.display = "none";
        }
        document.getElementById("susceptible").classList.remove("border-attractor-red");
        document.getElementById("infected").classList.remove("border-attractor-red");
        document.getElementById("pre-aids").classList.remove("border-attractor-red");
        document.getElementById("treated").classList.remove("border-attractor-red");
        document.getElementById("aids").classList.remove("border-attractor-red");

        document.getElementById("options-input").style.display = "inline";
    }
}

function validateParameter() {

    document.getElementById("option1-message").classList.add("hide");
    document.getElementById("option1").classList.remove("text-red");

    document.getElementById("option2-message").classList.add("hide");
    document.getElementById("option2").classList.remove("text-red");

    document.getElementById("option3-message").classList.add("hide");
    document.getElementById("option3").classList.remove("text-red");

    document.getElementById("generate-button").disabled = false;

    option1 = parseFloat(document.getElementById("option1").value);
    option2 = parseFloat(document.getElementById("option2").value);
    option3 = parseFloat(document.getElementById("option3").value);

    var parameter = document.getElementById("varying_parameter").value;

    if(parameter != "attractor_plot" && parameter != "no_variation") {
        if(option1 < lower_limit[parameter] || option1 > upper_limit[parameter]) {
            var option1_element = document.getElementById("option1-message");
            option1_element.innerHTML = "Parameter value should be between " + String(lower_limit[parameter]) + " and " + String(upper_limit[parameter]);
            option1_element.classList.remove("hide");
            document.getElementById("option1").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }

        if(option2 < lower_limit[parameter] || option2 > upper_limit[parameter]) {
            var option2_element = document.getElementById("option2-message");
            option2_element.innerHTML = "Parameter value should be between " + String(lower_limit[parameter]) + " and " + String(upper_limit[parameter]);
            option2_element.classList.remove("hide");
            document.getElementById("option2").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }

        if(option3 < lower_limit[parameter] || option3 > upper_limit[parameter]) {
            var option3_element = document.getElementById("option3-message");
            option3_element.innerHTML = "Parameter value should be between " + String(lower_limit[parameter]) + " and " + String(upper_limit[parameter]);
            option3_element.classList.remove("hide");
            document.getElementById("option3").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }
    }
}

function validate() {

    document.getElementById("total-message").classList.add("hide");
    document.getElementById("susceptible-message").classList.add("hide");
    document.getElementById("infected-message").classList.add("hide");
    document.getElementById("pre-aids-message").classList.add("hide");
    document.getElementById("treated-message").classList.add("hide");
    document.getElementById("aids-message").classList.add("hide");

    document.getElementById("susceptible").classList.remove("text-red");
    document.getElementById("infected").classList.remove("text-red");
    document.getElementById("pre-aids").classList.remove("text-red");
    document.getElementById("treated").classList.remove("text-red");
    document.getElementById("aids").classList.remove("text-red");

    document.getElementById("generate-button").disabled = false;


    initS = parseFloat(document.getElementById("susceptible").value);
    if(initS > 1 || initS < 0) {
        document.getElementById("susceptible-message").classList.remove("hide");
        document.getElementById("susceptible").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }
    initI = parseFloat(document.getElementById("infected").value);
    if(initI > 1 || initI < 0) {
        document.getElementById("infected-message").classList.remove("hide");
        document.getElementById("infected").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }
    initP = parseFloat(document.getElementById("pre-aids").value);
    if(initP > 1 || initP < 0) {
        document.getElementById("pre-aids-message").classList.remove("hide");
        document.getElementById("pre-aids").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }
    initT = parseFloat(document.getElementById("treated").value);
    if(initT > 1 || initT < 0) {
        document.getElementById("treated-message").classList.remove("hide");
        document.getElementById("treated").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }
    initA = parseFloat(document.getElementById("aids").value);
    if(initA > 1 || initA < 0) {
        document.getElementById("aids-message").classList.remove("hide");
        document.getElementById("aids").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }

    if (initS + initI + initT + initP + initA != 1) {
        document.getElementById("total-message").classList.remove("hide");
        document.getElementById("susceptible").classList.add("text-red");
        document.getElementById("infected").classList.add("text-red");
        document.getElementById("pre-aids").classList.add("text-red");
        document.getElementById("treated").classList.add("text-red");
        document.getElementById("aids").classList.add("text-red");
        document.getElementById("generate-button").disabled = true;
    }

    var option = document.getElementById("varying_parameter");
    var value;

    if(option.value == "attractor_plot") {

        allAddnInputs = [];
        for(var i=1; i <= 10; i++) {
            value = parseFloat(document.getElementById("add-input-" + i).value);
            allAddnInputs.push(value);
            document.getElementById("add-input-" + i).classList.remove("text-red");

            if(value > 1 || value < 0) {
                if(i==1 || i==2){
                    document.getElementById("susceptible-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }

                else if(i==3 || i==4){
                    document.getElementById("infected-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }

                else if(i==5 || i==6){
                    document.getElementById("pre-aids-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }

                else if(i==7 || i==8){
                    document.getElementById("treated-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }

                else if(i==9 || i==10){
                    document.getElementById("aids-message").classList.remove("hide");
                    document.getElementById("add-input-" + i).classList.add("text-red");
                    document.getElementById("generate-button").disabled = true;
                }
            }
        }

        if (allAddnInputs[0] + allAddnInputs[2] + allAddnInputs[4] + allAddnInputs[6] + allAddnInputs[8] != 1) {
            document.getElementById("total-message").classList.remove("hide");
            document.getElementById("add-input-" + "1").classList.add("text-red");
            document.getElementById("add-input-" + "3").classList.add("text-red");
            document.getElementById("add-input-" + "5").classList.add("text-red");
            document.getElementById("add-input-" + "7").classList.add("text-red");
            document.getElementById("add-input-" + "9").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }

        console.log("I am here");
        console.log();
        if (allAddnInputs[1] + allAddnInputs[3] + allAddnInputs[5] + allAddnInputs[7] + allAddnInputs[9] != 1) {
            document.getElementById("total-message").classList.remove("hide");
            document.getElementById("add-input-" + "2").classList.add("text-red");
            document.getElementById("add-input-" + "4").classList.add("text-red");
            document.getElementById("add-input-" + "6").classList.add("text-red");
            document.getElementById("add-input-" + "8").classList.add("text-red");
            document.getElementById("add-input-" + "10").classList.add("text-red");
            document.getElementById("generate-button").disabled = true;
        }
    }
}


var teamMembers = false;
function displayTeam() {

    if(!teamMembers) {
        document.getElementById("team").classList.remove("hide");
        document.getElementById("team-names").classList.add("team");
        teamMembers = true;
    }
    else {
        document.getElementById("team").classList.add("hide");
        document.getElementById("team-names").classList.remove("team");
        teamMembers = false;
    }
}
