
var symbol_dict = {
    "theta" : "θ",
    "epsilon" : "ε",
    "v" : "v",
    "beta1" : "β1",
    "beta3" : "β3",
    "sigma1" : "σ1",
    "sigma2" : "σ2",
    "k" : "k",
    "gamma" : "γ" ,
    "c1" : "c1",
    "c3" : "c3",
    "m" : "m",
    "pi" : "π",
    "delta" : "δ",
    "alpha" : "α"
}

var graph_top_1 = null;
var graph_top_2 = null;
var graph_top_3 = null;
var graph_top_4 = null;
var graph_top_5 = null;

var graph_bottom_1 = null;
var graph_bottom_2 = null;
var graph_bottom_3 = null;

var div_with_one_graph = `
    <div id="chart-carousel-1" class="carousel slide" data-interval="false">
        <!-- Wrapper for slides -->
        <div class="carousel-inner graph-outer">
            <div class="carousel-item graph-item active">
                <canvas id="graph-top-1" class="graph-item chart"></canvas>
            </div>
        </div>

        <!-- Left and right controls -->
        <a class="carousel-control-prev" href="#chart-carousel-1" data-slide="prev">
            <span class="carousel-control-prev-icon bg-dark"></span>
        </a>
        <a class="carousel-control-next" href="#chart-carousel-1" data-slide="next">
            <span class="carousel-control-next-icon bg-dark"></span>
        </a>
    </div> <!-- Carousel -->
`
var div_with_four_graphs = `
    <div id="chart-carousel-1" class="carousel slide" data-interval="false">
        <!-- Wrapper for slides -->
        <div class="carousel-inner graph-outer">
            <div class="carousel-item graph-item active">
                <canvas id="graph-top-1" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-2" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-3" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-4" class="graph-item chart"></canvas>
            </div>
        </div>

        <!-- Left and right controls -->
        <a class="carousel-control-prev" href="#chart-carousel-1" data-slide="prev">
            <span class="carousel-control-prev-icon bg-dark"></span>
        </a>
        <a class="carousel-control-next" href="#chart-carousel-1" data-slide="next">
            <span class="carousel-control-next-icon bg-dark"></span>
        </a>
    </div> <!-- Carousel -->
`

var div_with_five_graphs = `

    <div id="chart-carousel-1" class="carousel slide" data-interval="false">
        <!-- Wrapper for slides -->
        <div id="graph-outer-top" class="carousel-inner graph-outer">
            <div class="carousel-item graph-item active">
                <canvas id="graph-top-1" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-2" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-3" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-4" class="graph-item chart"></canvas>
            </div>
            <div class="carousel-item graph-item">
                <canvas id="graph-top-5" class="graph-item chart"></canvas>
            </div>
        </div>

        <!-- Left and right controls -->
        <a class="carousel-control-prev" href="#chart-carousel-1" data-slide="prev">
            <span class="carousel-control-prev-icon bg-dark"></span>
        </a>
        <a class="carousel-control-next" href="#chart-carousel-1" data-slide="next">
            <span class="carousel-control-next-icon bg-dark"></span>
        </a>
    </div> <!-- Carousel -->
`;

function Model(cur_s, cur_i, cur_p, cur_t, cur_a, theta,
    epsilon, v, beta1, beta3, sigma1, sigma2, k, gamma, c1, c3, m, pi_, delta, alpha, dt) {

    var del_s, del_i, del_p, del_t, del_a;
    micro = pi_ - (alpha*cur_a) + ((1-epsilon)*theta*cur_i);

    del_s = pi_ - (c1*beta1*cur_i*cur_s) - (c3*beta3*cur_t*cur_s);
    del_s = del_s *dt;
    del_i = (c1*beta1*cur_i*cur_s) + (c3*beta3*cur_t*cur_s) + ((1-epsilon)*theta*cur_i) - ((delta + micro)*cur_i);
    del_i = del_i *dt;
    del_p = (sigma1*delta*cur_i) - ((gamma + micro)*cur_p);
    del_p = del_p *dt;
    del_t = (sigma2*delta*cur_i) + (m*gamma*cur_p) + (v*cur_a) - ((k + micro)*cur_t);
    del_t = del_t *dt;
    del_a = ((1 - sigma1 - sigma2)*cur_i*delta) + ((1-m)*gamma*cur_p) + (k*cur_t) - ((v + alpha + micro)*cur_a);
    del_a = del_a *dt;



    return [del_s, del_i, del_p, del_t, del_a];
}

function calculateSEIR(data, initS, initI, initP, initT, initA, max_time=15, dt=1.0) {


    theta = data["theta"];
    epsilon = data["epsilon"];
    v = data["v"];
    beta1 = data["beta1"];
    beta3 = data["beta3"];
    sigma1 = data["sigma1"];
    sigma2 = data["sigma2"];
    k = data["k"];
    gamma = data["gamma"];
    c1 = data["c1"];
    c3 = data["c3"];
    m = data["m"];
    pi_ = data["pi"];
    delta = data["delta"];
    alpha = data["alpha"];
    cur_s = initS;
    cur_i = initI;
    cur_p = initP;
    cur_a = initA;
    cur_t = initT;


    init_pop = cur_s + cur_i + cur_p + cur_t + cur_a;

    all_s = [cur_s];
    all_i = [cur_i];
    all_p = [cur_p];
    all_t = [cur_t];
    all_a = [cur_a];
    all_pop = [init_pop];
    time = [0];

    var del_s, del_i, del_p, del_t, del_a;

    // Run for max_time iterations and calculate S, I, P, T and A for each time
    for(t=0; t<max_time; t+=dt) {
        [del_s, del_i, del_p, del_t, del_a] = Model(cur_s, cur_i, cur_p, cur_t, cur_a, theta,
            epsilon, v, beta1, beta3, sigma1, sigma2, k, gamma, c1, c3, m, pi_, delta, alpha, dt);

        cur_s = cur_s + del_s;
        cur_i = cur_i + del_i;
        cur_p = cur_p + del_p;
        cur_t = cur_t + del_t;
        cur_a = cur_a + del_a;

        all_s.push(cur_s/(cur_s + cur_i + cur_p + cur_t + cur_a));
        all_i.push(cur_i/(cur_s + cur_i + cur_p + cur_t + cur_a));
        all_p.push(cur_p/(cur_s + cur_i + cur_p + cur_t + cur_a));
        all_t.push(cur_t/(cur_s + cur_i + cur_p + cur_t + cur_a));
        all_a.push(cur_a/(cur_s + cur_i + cur_p + cur_t + cur_a));

        all_pop.push(cur_s + cur_i + cur_p + cur_t + cur_a);

        time.push(t+dt);
    }

    return [time, all_s, all_i, all_p, all_t, all_a];
}

function calculateAttactor(data, cur_s1, cur_i1, cur_p1, cur_t1, cur_a1, cur_s2, cur_i2, cur_p2, cur_t2, cur_a2,
    cur_s3, cur_i3, cur_p3, cur_t3, cur_a3) {

    max_time = 75;
    dt = 0.5;

    data["theta"] = 0.3;
    data["pi"] = 0.4;
    data["max_time"] = max_time * dt;

    var time, all_s1, all_s2, all_s3, all_i1, all_i2, all_i3, all_p1, all_p2, all_p3, all_t1, all_t2, all_t3, all_a1, all_a2, all_a3;

    [time, all_s1, all_i1, all_p1, all_t1, all_a1] = calculateSEIR(data, cur_s1, cur_i1, cur_p1, cur_t1, cur_a1, max_time=max_time, dt=dt);
    [time, all_s2, all_i2, all_p2, all_t2, all_a2] = calculateSEIR(data, cur_s2, cur_i2, cur_p2, cur_t2, cur_a2, max_time=max_time, dt=dt);
    [time, all_s3, all_i3, all_p3, all_t3, all_a3] = calculateSEIR(data, cur_s3, cur_i3, cur_p3, cur_t3, cur_a3, max_time=max_time, dt=dt);

    return [time, all_s1, all_i1, all_p1, all_t1, all_a1, all_s2, all_i2, all_p2, all_t2, all_a2, all_s3, all_i3, all_p3, all_t3, all_a3];
}

function drawSEIR(graph_element, graph, time, s, i, p, t, a, title_addn="") {

    // Destroy previous canvas
    if(graph)
        graph.destroy();

    var radius = 1;
    var borderWidth = 2;
    var new_graph = new Chart(graph_element, {
        type: "line",
        data: {
            labels : time,
            datasets : [{
                data : s,
                backgroundColor : "red",
                borderColor : "red",
                fill : false,
                label : "susceptible",
                borderWidth: borderWidth,
                pointRadius: radius
            },
            {
                data : i,
                backgroundColor : "green",
                borderColor : "green",
                fill : false,
                label : "infectious",
                borderWidth: borderWidth,
                pointRadius: radius
            },
            {
                data : p,
                backgroundColor : "blue",
                borderColor : "blue",
                fill : false,
                label : "pre-AIDs",
                borderWidth: borderWidth,
                pointRadius: radius
            },
            {
                data : t,
                backgroundColor : "black",
                borderColor : "black",
                fill : false,
                label : "treated",
                borderWidth: borderWidth,
                pointRadius: radius
            },
            {
                data : a,
                backgroundColor : "orange",
                borderColor : "orange",
                fill : false,
                label : "aids",
                borderWidth: borderWidth,
                pointRadius: radius
            },
        ]},
        options : {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'proportion of population'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'time'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'population vs time ' + title_addn
                }
            },
            animation: {
                duration: 0
            }
        }
    });

    return new_graph;
}

function drawVariation(graph_element, graph, time, data1, data2, data3, y_label, legend_labels=[1,2,3]) {
    // Destroy previous canvas
    if(graph)
        graph.destroy();

    radius = 1;
    borderWidth = 2;

    // Plot the graph with separate line for each parameter value
    new_graph = new Chart(graph_element, {
        type: 'line',
        data: {
            labels : time,
            datasets: [
                {
                    label: legend_labels[0],
                    data: data1,
                    showLine: true,
                    fill: false,
                    backgroundColor : "brown",
                    borderColor: 'brown',
                    borderWidth: borderWidth  ,
                    pointRadius: radius
                },
                {
                    label: legend_labels[1],
                    data: data2,
                    showLine: true,
                    fill: false,
                    backgroundColor : "violet",
                    borderColor: 'violet',
                    borderWidth: borderWidth,
                    pointRadius: radius
                },
                {
                    label: legend_labels[2],
                    data: data3,
                    showLine: true,
                    fill: false,
                    backgroundColor : "cyan",
                    borderColor: 'cyan',
                    borderWidth: borderWidth,
                    pointRadius: radius
                }
            ]
        },
        options : {
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'proportion of ' + y_label + ' population'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'time'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: y_label + " vs time"
                }
            },
            animation: {
                duration: 0
            }
        }
    });

    return new_graph;
}

function drawAttractor(graph_element, graph, time, s1, s2, s3, other_class1, other_class2, other_class3, y_label) {
    // Destroy previous canvas
    if(graph)
        graph.destroy();

    // Store in separate array for different start point
    data1 = [];
    data2 = [];
    data3 = [];
    for (idx=0; idx<s1.length; idx++) {
        data1.push({x: s1[idx], y: other_class1[idx]})
        data2.push({x: s2[idx], y: other_class2[idx]})
        data3.push({x: s3[idx], y: other_class3[idx]})
    }

    pointRadius = 0;

    initial_point = [data1[0], data2[0], data3[0]];
    final_point = [data1[data1.length-1], data2[data2.length-1], data3[data3.length-1]];


    // Plot the graph
    new_graph = new Chart(graph_element, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'initial values 1',
                    data: data1,
                    showLine: true,
                    fill: false,
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: 1,
                    pointRadius: pointRadius
                },
                {
                    label: 'initial values 2',
                    data: data2,
                    showLine: true,
                    fill: false,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: 1,
                    pointRadius: pointRadius
                },
                {
                    label: 'initial values 3',
                    data: data3,
                    showLine: true,
                    fill: false,
                    backgroundColor: 'green',
                    borderColor: 'green',
                    borderWidth: 1,
                    pointRadius: pointRadius
                },
                {
                    label: 'initial point',
                    data: initial_point,
                    showLine: false,
                    fill: true,
                    backgroundColor: 'orange',
                    borderColor: 'orange',
                    borderWidth: 1,
                    pointRadius: pointRadius+5
                },
                {
                    label: 'final point',
                    data: final_point,
                    showLine: false,
                    fill: true,
                    backgroundColor: 'black',
                    borderColor: 'black',
                    borderWidth: 1,
                    pointRadius: pointRadius+5
                }
            ]
        },
        options : {
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'proportion of ' + y_label + ' population'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'proportion of susceptible population'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'susceptible vs ' + y_label
                },
                autocolors: false,
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: data1[5].y,
                            yMax: data1[6].y,
                            xMin: data1[5].x,
                            xMax: data1[6].x,
                            borderColor: 'red',
                            borderWidth: 1,
                            width: 1,
                            arrowHeads: {
                                end : {
                                    fill: true,
                                    display: true
                                }
                            }
                        },
                        line2: {
                            type: 'line',
                            yMin: data2[6].y,
                            yMax: data2[7].y,
                            xMin: data2[6].x,
                            xMax: data2[7].x,
                            borderColor: 'blue',
                            borderWidth: 1,
                            width: 1,
                            arrowHeads: {
                                end : {
                                    fill: true,
                                    display: true
                                }
                            }
                        },
                        line3: {
                            type: 'line',
                            yMin: data3[7].y,
                            yMax: data3[8].y,
                            xMin: data3[7].x,
                            xMax: data3[8].x,
                            borderColor: 'green',
                            borderWidth: 1,
                            width: 1,
                            arrowHeads: {
                                end : {
                                    fill: true,
                                    display: true
                                }
                            }
                        }
                    }
                }
            },
            animation: {
                duration: 0
            },
            legend: {
                display : false,
            }
        }
    });

    return new_graph;
}


function generateGraph() {

    data = {
        theta : 0,
        epsilon : 0.2,
        v : 0.1,
        beta1 : 0.4,
        beta3 : 0.05,
        c1 : 3,
        c3 : 1,
        delta : 0.6,
        sigma1 : 0.2,
        sigma2 : 0.01,
        k : 0.08,
        gamma : 0.9,
        m : 0.4,
        alpha : 1,
        pi : 0
    }

    var comment = "";
    var option = document.getElementById("varying_parameter");

    if(option.value=="no_variation") {

        document.getElementById('graph-top').innerHTML = "";
        var div = document.createElement('div');
        div.innerHTML = div_with_one_graph;
        document.getElementById('graph-top').appendChild(div);

        initS = parseFloat(document.getElementById("susceptible").value);
        initI = parseFloat(document.getElementById("infected").value);
        initP = parseFloat(document.getElementById("pre-aids").value);
        initT = parseFloat(document.getElementById("treated").value);
        initA = parseFloat(document.getElementById("aids").value);
        [time, s, i, p, t, a] = calculateSEIR(data, initS, initI, initP, initT, initA);

        graph_element = document.getElementById("graph-top-1");
        graph_top_1 = drawSEIR(graph_element, graph_top_1, time, s, i, p, t, a);

        deleteGraphs = [graph_top_2, graph_top_3, graph_top_4, graph_top_5];
        for(i=0; i<deleteGraphs.length; i++) {
            if(deleteGraphs[i])
                deleteGraphs[i].destroy();
        }

        document.getElementById("graph-top").style.display = "block";
        document.getElementById("graph-bottom").style.display = "none";

        comment = "The graph shows the variation of class values with time.";


    }

    else if(option.value=="attractor_plot") {

        document.getElementById('graph-top').innerHTML = "";
        var div = document.createElement('div');
        div.innerHTML = div_with_four_graphs;
        document.getElementById('graph-top').appendChild(div);

        initS1 = parseFloat(document.getElementById("susceptible").value);
        initS2 = parseFloat(document.getElementById("add-input-1").value);
        initS3 = parseFloat(document.getElementById("add-input-2").value);

        initI1 = parseFloat(document.getElementById("infected").value);
        initI2 = parseFloat(document.getElementById("add-input-3").value);
        initI3 = parseFloat(document.getElementById("add-input-4").value);

        initP1 = parseFloat(document.getElementById("pre-aids").value);
        initP2 = parseFloat(document.getElementById("add-input-5").value);
        initP3 = parseFloat(document.getElementById("add-input-6").value);

        initT1 = parseFloat(document.getElementById("treated").value);
        initT2 = parseFloat(document.getElementById("add-input-7").value);
        initT3 = parseFloat(document.getElementById("add-input-8").value);

        initA1 = parseFloat(document.getElementById("aids").value);
        initA2 = parseFloat(document.getElementById("add-input-9").value);
        initA3 = parseFloat(document.getElementById("add-input-10").value);

        [time, all_s1, all_i1, all_p1, all_t1, all_a1,
               all_s2, all_i2, all_p2, all_t2, all_a2,
               all_s3, all_i3, all_p3, all_t3, all_a3] = calculateAttactor(data,initS1, initI1, initP1, initT1, initA1,
                                                                                initS2, initI2, initP2, initT2, initA2,
                                                                                initS3, initI3, initP3, initT3, initA3);

        if(graph_top_5)
            graph_top_5.destroy();

        // Draw Attractor only
        graph_element = document.getElementById("graph-top-1");
        graph_top_1 = drawAttractor(graph_element, graph_top_1, time, all_s1, all_s2, all_s3, all_i1, all_i2, all_i3, "infected");

        graph_element = document.getElementById("graph-top-2");
        graph_top_2 = drawAttractor(graph_element, graph_top_2, time, all_s1, all_s2, all_s3, all_p1, all_p2, all_p3, "pre-AIDS");

        graph_element = document.getElementById("graph-top-3");
        graph_top_3 = drawAttractor(graph_element, graph_top_3, time, all_s1, all_s2, all_s3, all_t1, all_t2, all_t3, "treated");

        graph_element = document.getElementById("graph-top-4");
        graph_top_4 = drawAttractor(graph_element, graph_top_4, time, all_s1, all_s2, all_s3, all_a1, all_a2, all_a3, "AIDS");

        document.getElementById("graph-top").style.display = "block";
        document.getElementById("graph-bottom").style.display = "none";

        document.getElementById("graph-outer-bottom").style.height = "350px";
        document.getElementById("graph-outer-top").style.height = "350px";


        comment = "The graph shows the variation of each class with susceptiple population. The values converge to a single equilibrium point from different inital values. Hence it is a attractor plot.";
    }

    else {

        document.getElementById('graph-top').innerHTML = "";
        var div = document.createElement('div');
        div.innerHTML = div_with_five_graphs;
        document.getElementById('graph-top').appendChild(div);

        initS = parseFloat(document.getElementById("susceptible").value);
        initI = parseFloat(document.getElementById("infected").value);
        initP = parseFloat(document.getElementById("pre-aids").value);
        initT = parseFloat(document.getElementById("treated").value);
        initA = parseFloat(document.getElementById("aids").value);

        var varying_parameter =  document.getElementById("varying_parameter").value;
        var option1 = document.getElementById("option1").value;
        var option2 = document.getElementById("option2").value;
        var option3 = document.getElementById("option3").value;

        data[varying_parameter] = parseFloat(option1);
        [time, s1, i1, p1, t1, a1] = calculateSEIR(data,initS, initI, initP, initT, initA);

        data[varying_parameter] = parseFloat(option2);
        [time, s2, i2, p2, t2, a2] = calculateSEIR(data, initS, initI, initP, initT, initA);

        data[varying_parameter] = parseFloat(option3);
        [time, s3, i3, p3, t3, a3] = calculateSEIR(data, initS, initI, initP, initT, initA);

        legend_labels = [
            symbol_dict[varying_parameter] + "=" + String(option1),
            symbol_dict[varying_parameter] + "=" + String(option2),
            symbol_dict[varying_parameter] + "=" + String(option3)
        ];

        graph_element = document.getElementById("graph-top-1");
        graph_top_1 = drawVariation(graph_element, graph_top_1, time, s1, s2, s3, "susceptible", legend_labels);

        graph_element = document.getElementById("graph-top-2");
        graph_top_2 = drawVariation(graph_element, graph_top_2, time, i1, i2, i3, "infected", legend_labels);

        graph_element = document.getElementById("graph-top-3");
        graph_top_3 = drawVariation(graph_element, graph_top_3, time, p1, p2, p3, "pre-Aids", legend_labels);

        graph_element = document.getElementById("graph-top-4");
        graph_top_4 = drawVariation(graph_element, graph_top_4, time, t1, t2, t3, "treated", legend_labels);

        graph_element = document.getElementById("graph-top-5");
        graph_top_5 = drawVariation(graph_element, graph_top_5, time, a1, a2, a3, "AIDS patient", legend_labels);

        graph_element = document.getElementById("graph-bottom-1");
        graph_bottom_1 = drawSEIR(graph_element, graph_bottom_1, time, s1, i1, p1, t1, a1, legend_labels[0]);

        graph_element = document.getElementById("graph-bottom-2");
        graph_bottom_2 = drawSEIR(graph_element, graph_bottom_2, time, s2, i2, p2, t2, a2, legend_labels[1]);

        graph_element = document.getElementById("graph-bottom-3");
        graph_bottom_3 = drawSEIR(graph_element, graph_bottom_3, time, s3, i3, p3, t3, a3, legend_labels[2]);

        document.getElementById("graph-top").style.display = "block";
        document.getElementById("graph-bottom").style.display = "block";

        document.getElementById("graph-outer-top").style.height = "250px";
        document.getElementById("graph-outer-bottom").style.height = "250px";

        comment = "The graph on the top shows the variation of each class values for different parameter values. The second graph shows the variation of class values for each parameter value.";
    }

    document.getElementById("comment").innerHTML = comment;
    document.getElementById("comment-section").style.display = "block";
}
