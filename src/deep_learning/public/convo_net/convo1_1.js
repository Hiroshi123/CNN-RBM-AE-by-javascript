/**
 * Created by hiroshi on 11/07/15.
 */

//window.onload = function() {
function init_setting(){
    FEATURE_NUM = parseInt(document.getElementById("feature_num").value);
    reduction = 2;
    ws = new Array(FEATURE_NUM);
    kind = 0;
    drop_out = 0.5;
    switch1 = false;
    valid = false;


    for (var i = 0; i < ws.length; i++) {
        ws[i] = new Array(3);
        for (var j = 0; j < 3; j++) {
            ws[i][j] = new Array(3);
        }
    }


    for (var f = 0; f < FEATURE_NUM; f++) {
        for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {

            ws[f][i][j] = Math.random() * 2 - 1;

            //console.log(ws[f][i][j]);
        }
    }

    var hidden_num = srcs.length;

    var final_node = srcs.length;

    edge_array = new Array(FEATURE_NUM);

    for (var k = 0; k < edge_array.length; k++) {
        edge_array[k] = new Array(sd_image[0].length);
        for (var i = 0; i < edge_array[k].length; i++) {
            edge_array[k][i] = new Array(sd_image[0][0].length);
        }
    }

    for (var f = 0; f < edge_array.length; f++) {
        for (var i = 0; i < edge_array[0].length; i++) for (var j = 0; j < edge_array[0][i].length; j++) {
            edge_array[f][i][j] = 0;
        }
    }

    max_array = new Array(FEATURE_NUM);


    for (var i = 0; i < max_array.length; i++) {
        max_array[i] = new Array(edge_array[0].length / reduction);
        for (var j = 0; j < max_array[0].length; j++) {
            max_array[i][j] = new Array(edge_array[0][0].length / reduction);
        }
    }


    //prepare array

    input_array = new Array(max_array[0].length);

    for(var i=0;i<input_array.length;i++){
        input_array[i] = new Array(max_array[0][0].length);
    }

    for(var i=0;i<input_array.length;i++) for(var j=0;j<input_array[i].length;j++) {
        input_array[i][j]=0;
    }
    wf1 = new Array(input_array.length*input_array[0].length);
    for (var i = 0; i < wf1.length; i++) {
        wf1[i] = new Array(hidden_num);
        }

    bias_w = new Array(final_node);
    for(var i=0;i<bias_w.length;i++){
        bias_w[i] = 0;
    }
    bias_value = -1;

    wf2 = new Array(hidden_num);
    for (var i = 0; i < wf2.length; i++) {
        wf2[i] = new Array(final_node);
    }
    //randomize
    for (var i = 0; i < wf1.length; i++) for (var j = 0; j < wf1[i].length; j++) {
            wf1[i][j] = Math.random() * 2 - 1;
            //console.log(ws[f][i][j]);
    }
    for (var i = 0; i < wf2.length; i++) for (var j = 0; j < wf2[i].length; j++) {
            wf2[i][j] = Math.random() * 2 - 1;
            //console.log(ws[f][i][j]);
    }

    //prepare output_node & teacher_node & errors & middle_errors


    output_node = new Array(final_node);
    errors = new Array(final_node);
    teacher_node = new Array(final_node);
    middle_errors = new Array(FEATURE_NUM);

    error = 0;


    for (var f = 0; f < output_node.length; f++) {
        teacher_node[f] = new Array(final_node);
    }

    /*
     for (var f = 0; f < output_node.length; f++) {
     output_node[f] = new Array();
     teacher_node[f] = new Array(final_node);
     errors[f] = new Array(final_node);
     }
     */

    for (var f = 0; f < middle_errors.length; f++) {
        middle_errors[f] = new Array(max_array[f].length);
        for (var i = 0; i < middle_errors[f].length; i++) {
            middle_errors[f][i] = new Array(max_array[f][i].length);
        }
    }

    for (var i = 0; i < middle_errors.length; i++) {
        for (var j = 0; j < middle_errors[i].length; j++)for (var k = 0; k < middle_errors[i][j].length; k++){
            middle_errors[i][j][k] = 0;
        }
    }
    //initialize output_node & teacher_node

    for(var i=0;i<output_node.length;i++){
        output_node[i] = 0;
        errors[i] = 0;
        for(var j=0;j<teacher_node[0].length;j++) {
            if (i == j) {
                teacher_node[i][j] = 1;
            } else {
                teacher_node[i][j] = 0.0;
            }
        }
    }

    console.log(output_node.length);

}


function conv1() {

    //var kind = document.getElementById("picture_select").value-1;
    //kind = document.getElementById("picture_select").value-1;

    console.log(kind);
    //console.log("w",ws[0][1][1],wf1[0][1][1]);

    var canvas2 = document.getElementById('canvas2');
    var context2 = canvas2.getContext('2d');
    context2.clearRect(0, 0, canvas2.width, canvas2.height);

    var sum_edge = 0;


    for (var f = 0; f < FEATURE_NUM; f++) {

        for (var i = 0; i < sd_image[kind].length; i++) for (var j = 0; j < sd_image[kind][kind].length; j++) {

            edge_array[f][i][j] = 0;

            for (var ii = i - 1; ii <= i + 1; ii++) for (var jj = j - 1; jj <= j + 1; jj++) {

                if (ii < 0 || jj < 0 || ii >= sd_image[0].length || jj >= sd_image[0][0].length) {
                } else {
                    edge_array[f][i][j] += sd_image[kind][ii][jj] * ws[f][ii - i + 1][jj - j + 1];
                }
                edge_array[f][i][j] = sigmoid(edge_array[f][i][j]);
                //console.log(edge_array[4][4][0]);

                //for (var i = 0; i < sd_image[0].length; i++) for (var j = 0; j < sd_image[0][0].length; j++) {
                context2.fillStyle = 'rgba(' + Math.ceil(edge_array[f][i][j] * 255) + ','
                + Math.ceil(edge_array[f][i][j] * 255) + ','
                + Math.ceil(edge_array[f][i][j] * 255) + ', 255 )';

                var temp_1 = f % 3;
                if (f == 0) {
                    var temp_2 = 0;
                } else {
                    var temp_2 = Math.floor(f / 3);
                }
                context2.fillRect(temp_2 * (canvas2.width / 3) + j * (canvas2.width / (3 * edge_array[0].length)),
                    temp_1 * (canvas2.height / 3) + i * (canvas2.height / (3 * edge_array[0][0].length)),
                    (canvas2.width / (3 * edge_array[0].length)),
                    (canvas2.height / (3 * edge_array[0][0].length)));

                //console.log(temp_2 * (canvas4.width / 3), temp_1 * (canvas4.height / 3));
            }
        }
    }
    display_weight();
    pooling();
}

function display_weight(){

    var canvas2_1 = document.getElementById("canvas2_1");
    var context2_1 = canvas2_1.getContext('2d');
    context2_1.clearRect(0,0,canvas2_1.width,canvas2_1.height);

    var max = 0;
    var mim = 0;

    for(var f=0;f< ws.length;f++) {
        for (var i = 0; i < ws[f].length; i++)for (var j = 0; j < ws[f][i].length; j++) {
            if (ws[f][i][j] > max) max = ws[f][i][j];
            if (ws[f][i][j] < mim) mim = ws[f][i][j];
        }
    }

    for(var f=0;f< ws.length;f++) {
        for (var i = 0; i < ws[f].length; i++)for (var j = 0; j < ws[f][i].length; j++) {

            context2_1.fillStyle = 'rgba(' + Math.ceil(sigmoid(ws[f][i][j]/Math.abs(mim)) * 255) + ','
            + Math.ceil(sigmoid(ws[f][i][j]/Math.abs(mim)) * 255) + ','
            + Math.ceil(sigmoid(ws[f][i][j]/Math.abs(mim)) * 255) + ', 255 )';


            var temp_1 = f % 3;
            if (f == 0) {
                var temp_2 = 0;
            } else {
                var temp_2 = Math.floor(f / 3);
            }

            context2_1.fillRect(temp_2 * (canvas2_1.width / 3) + j * (canvas2_1.width / (3 * ws[0].length)),
                temp_1 * (canvas2_1.height / 3) + i * (canvas2_1.height / (3 * ws[0][0].length)),
                (canvas2_1.width / (3 * ws[0].length)),
                (canvas2_1.height / (3 * ws[0][0].length)));
        }
    }

}

function pooling(){

    var canvas3 = document.getElementById('canvas3');
    var context3 = canvas3.getContext('2d');
    context3.clearRect(0,0,canvas3.width,canvas3.height);

    for(var f = 0 ; f < edge_array.length  ; f++  ) {

        for (var i = 0; i < edge_array[0].length; i += reduction) for (var j = 0; j < edge_array[0][i].length; j += reduction) {

            var temp_i = parseInt(i * (1/reduction) );
            var temp_j = parseInt(j * (1/reduction) );
            max_array[f][temp_i][temp_j] = 0;

            for (var p = i; p < i + reduction; p++) for (var q = j; q < j + reduction; q++) {

                if (edge_array[f][p][q] > max_array[f][temp_i][temp_j]) {
                    max_array[f][temp_i][temp_j] = edge_array[f][p][q];
                }
            }


            context3.fillStyle = 'rgba(' + Math.ceil(max_array[f][temp_i][temp_j] * 255) + ','
            + Math.ceil(max_array[f][temp_i][temp_j] * 255) + ','
            + Math.ceil(max_array[f][temp_i][temp_j] * 255) + ', 255 )';


            var temp_1 = f % 3;
            if(f == 0) {
                var temp_2 = 0;
            } else {
                var temp_2 = Math.floor(f / 3);
            }
            context3.fillRect( temp_2 * (canvas3.width / 3) + j * (canvas3.width / (3*edge_array[0].length)),
                temp_1 * (canvas3.height / 3) + i * (canvas3.height / (3*edge_array[0][0].length)),
                (canvas3.width / (3*edge_array[0].length)),
                (canvas3.height / (3*edge_array[0][0].length)) );
        }

        //console.log(temp_2 * (canvas6.width / 3) ,temp_1 * (canvas6.height / 3));
    }

    integration();
    full_connect();
}


function integration(){

    for(var i=0;i<input_array.length;i++) for(var j=0;j<input_array[i].length;j++) {
        input_array[i][j]=0;
    }

    for(var i=0;i<max_array.length;i++) {
        for (var j = 0; j < max_array[i].length; j++) for (var k = 0; k < max_array[i][j].length; k++) {
            input_array[j][k] += max_array[i][j][k];
        }
    }
    for(var i=0;i<max_array.length;i++) {
        for (var j = 0; j < max_array[i].length; j++) for (var k = 0; k < max_array[i][j].length; k++) {
            input_array[i][j] = input_array[i][j] / (max_array.length);
        }
    }
    console.log(input_array[3][4]);
}

function full_connect() {

    var canvas3_1 = document.getElementById('canvas3_1');
    var context3_1 = canvas3_1.getContext('2d');
    context3_1.clearRect(0, 0, canvas3_1.width, canvas3_1.height);
    context3_1.strokeRect(0, 0, canvas3_1.width, canvas3_1.height);

    /*
     for (var f = 0; f < wf1.length; f++) {
     for (var i = 0; i < wf1[f].length; i++)for (var j = 0; j < wf1[f][i].length; j++) {

     context3_1.fillStyle = 'rgba(' + Math.ceil(sigmoid(wf1[f][i][j]) * 255) + ','
     + Math.ceil(sigmoid(wf1[f][i][j]) * 255) + ','
     + Math.ceil(sigmoid(wf1[f][i][j]) * 255) + ', 255 )';

     var temp_1 = f % 3;
     if (f == 0) {
     var temp_2 = 0;
     } else {
     var temp_2 = Math.floor(f / 3);
     }

     context3_1.fillRect(temp_2 * (canvas3_1.width / 3) + j * (canvas3_1.width / (3 * wf1[0].length)),
     temp_1 * (canvas3_1.height / 3) + i * (canvas3_1.height / (3 * wf1[0][0].length)),
     (canvas3_1.width / (3 * wf1[0].length)),
     (canvas3_1.height / (3 * wf1[0][0].length)));
     }
     }
     */

    //console.log("hi",wf1[2][2][2]);

    var learning_rate = parseFloat(document.getElementById("learning_rate").value);

    //var kind = document.getElementById("picture_select").value-1;

    console.log(max_array[0].length);

    //feed_forward

    if (kind == 0) error = 0;

    var errors_stock = 0;

    var max = 0;
    var result = 0;

    console.log(output_node.length);

    for (var i = 0; i < output_node.length; i++) {
        output_node[i] = 0;
        for (var j = 0; j < input_array.length; j++) for (var k = 0; k < input_array[j].length; k++) {
            output_node[i] += input_array[j][k] * wf1[j * input_array.length + k][i];
        }
        output_node[i]+=bias_value*bias_w[i];
        output_node[i] = sigmoid(output_node[i]);
        if(valid == true) {
            if (output_node[i] > max) {
                max = output_node[i];
                result = i;
            }
        }
        errors[i] = (teacher_node[kind][i] - output_node[i]);//*output_node[i]*(1-output_node[i]);
        error += 0.5 * Math.pow(teacher_node[kind][i] - output_node[i], 2);
        errors_stock += errors[i];
    }

    if(valid == true){
        valid = false;
        document.getElementById("answer").innerText = result;
        console.log(max);

        return
    }

    console.log("errors_stock",errors_stock);
    console.log("error",error);

    //error_propagation

    for(var f = 0 ; f < FEATURE_NUM ; f++ ) {
        for (var j = 0; j < max_array[f].length; j++) for (var k = 0; k < max_array[f].length; k++) {
            middle_errors[f][j][k] = 0;
            for (var i = 0; i < output_node.length; i++) {
                middle_errors[f][j][k] += errors[i] * wf1[j * input_array.length + k][i];
            }
            middle_errors[f][j][k] = middle_errors[f][j][k] * max_array[f][j][k] * (1-max_array[f][j][k]);
        }
        //middle_errors[f][j][k] = middle_errors[f][j][k];
    }

    console.log("middle",middle_errors[0][2][2]);
    console.log("middle",errors[3]);


    //adjust weight

    var stock = 0;

    for (var i = 0; i < output_node.length; i++) {
        for (var j = 0; j < input_array.length; j++) for (var k = 0; k < input_array[j].length; k++) {
            wf1[j * input_array.length + k][i] += input_array[j][k] * errors[i] * learning_rate;
            if(j==0 && k==0) {
                bias_w[i] += bias_value * errors[i] * learning_rate;
            }
            stock += input_array[j][k] * errors[i] * learning_rate;
        }
    }
    console.log(bias_w[4]);


    console.log("stock1",stock/FEATURE_NUM);


    var stock = 0;

    for (var f = 0; f < FEATURE_NUM; f++) {

        for (var i = 0; i < sd_image[0].length; i+=reduction) for (var j = 0; j < sd_image[0][0].length; j+=reduction) {

            for (var ii = i - 1; ii <= i + 1; ii++) for (var jj = j - 1; jj <= j + 1; jj++) {

                if (ii < 0 || jj < 0 || ii+1 >= sd_image[0].length || jj+1 >= sd_image[0][0].length) {
                } else {
                    for(var iii=0;iii<reduction;iii++)for(var jjj=0;jjj<reduction;jjj++) {
                        if (edge_array[f][i+iii][j+jjj] == max_array[f][Math.floor(i / reduction)][Math.floor(j / reduction)]) {
                            //if (ws[f][ii - i + 1][jj - j + 1] * middle_errors[f][Math.floor(i / 2)][Math.floor(j / 2)] > 0){
                            ws[f][ii - i + 1][jj - j + 1]
                                += sd_image[kind][ii+iii][jj+jjj] * middle_errors[f][Math.floor(i / reduction)][Math.floor(j / reduction)] * learning_rate/FEATURE_NUM;
                                //if(ws[f][ii - i + 1][jj - j + 1] > 1) ws[f][ii - i + 1][jj - j + 1] = 1;
                                //if(ws[f][ii - i + 1][jj - j + 1] < -1) ws[f][ii - i + 1][jj - j + 1] = -1;
                            stock += sd_image[kind][i+iii][j+jjj] * middle_errors[f][Math.floor(i / reduction)][Math.floor(j / reduction)] * learning_rate;
                            //}
                            break;
                        }
                    }
                }
            }
        }
    }

    for(var i=0;i<ws.length;i++) for(var j=0;j<ws[0].length;j++) for(var k=0;k<ws[0][0].length;k++){
        ws[i][j][k] = sigmoid(ws[i][j][k])*2-1;
    }

    //normalize
    /*

     var mean = new Array(FEATURE_NUM);
     var distance = new Array(FEATURE_NUM);

     for(var i=0;i<mean.length;i++) mean[i] = 0;
     for(var i=0;i<distance.length;i++) distance[i] = 0;

     for(var i=0;i<ws.length;i++) {
     var sum = 0;
     for (var j = 0; j < ws[i].length; j++)for (var k = 0; k < ws[i][j].length; k++) {

     sum += ws[i][j][k];
     }
     mean[i] = sum/(ws[0].length*ws[0][0].length);
     }

     for(var i=0;i<ws.length;i++) {
     for (var j = 0; j < ws[i].length; j++)for (var k = 0; k < ws[i][j].length; k++) {
     distance[i] += Math.pow(ws[i][j][k]-mean[i],2);
     }
     distance[i] = Math.sqrt(distance[i])/(ws[0].length*ws[0][0].length);
     }

     for(var i=0;i<ws.length;i++) {
     for (var j = 0; j < ws[i].length; j++)for (var k = 0; k < ws[i][j].length; k++) {
     ws[i][j][k] = (ws[i][j][k]-mean[i]) / (2*distance[i]);
     }
     }
     */

    console.log("stock2",stock/FEATURE_NUM);
    kind += 1;
    if(kind<10 && switch1 == false){
        setTimeout('conv1()',100);
    }else if(switch1 == true){
    }else{
        kind = 0;
        document.getElementById("error").innerText = error;
        setTimeout('conv1()',100);
    }
}

function stop(){
    switch1 = true;
}

function restart(){
    switch1 = false;
    conv1();
}

function validation(){
    kind = document.getElementById("ft").value;
    valid = true;
    conv1();
}