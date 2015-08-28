/**
 * Created by hiroshi on 01/06/15.
 */

function layer_number(){

    var parent_object = document.getElementById("aa");
    while(parent_object.hasChildNodes()) {
        parent_object.removeChild(parent_object.childNodes[0]);
    }

    var layer_name = [" LAYER1: "," LAYER2: "," LAYER3: "," LAYER4: "," LAYER5: "," LAYER6: "," LAYER7: "];

    var NUM = (document.getElementById("LAYER NUMBER").value);

    for(var i=0;i<NUM;i++)
    {
        var div_element1 = document.createElement("span");
        div_element1.innerHTML = '<label name="layer_name"> </label>';
        parent_object.appendChild(div_element1);
        document.getElementsByName("layer_name")[i].innerText = layer_name[i];

        var div_element2 = document.createElement("span");
        div_element2.innerHTML = '<input type="text" name="LAYERS" size = 5>';
        parent_object.appendChild(div_element2);
    }


    for(var i=0;i<=Math.floor(NUM/2);i++){

        if(i<Math.ceil(NUM/2)) {
            document.getElementsByName("LAYERS")[i].value = Math.floor(W*(10-i)/10);
            document.getElementsByName("LAYERS")[NUM - i - 1].value = Math.floor(W*(10-i)/10);
        }else{
            document.getElementsByName("LAYERS")[i].value = Math.floor(W*(10-i)/10);
        }
    }

    var parent_object2 = document.getElementById("bb");

    if (parent_object2.hasChildNodes()) {
        while (parent_object2.childNodes.length > 0) {
            parent_object2.removeChild(parent_object2.firstChild)
        }
    }

    for ( i = 0 ; i < parseInt(document.getElementById("LAYER NUMBER").value); i++ ){
        var option = document.createElement("option");
        parent_object2.appendChild(option);

        option.innerHTML = layer_name[i];
    }
}


function initialize(Name){

    for(var i = 0 ; i < Name.length ; i++ )for(var j=0 ;j < Name[i].length;j++)for(var k=0 ;k < Name[i][j].length;k++){
        Name[i][j][k] = 0;
    }

}

function feedforward(input_node,output_node,weight,bias,transpose) {

    var I_L = input_node.length;
    var O_L = output_node.length;

    var sum = 0;

    for (var i = 0; i < O_L; i++) for (var j = 0; j < O_L; j++) {
        output_node[i][j] = 0;
        for (var k = 0; k < I_L; k++) for (var l = 0; l < I_L; l++) {
            if (transpose == 0) {
                output_node[i][j] += input_node[k][l] * weight[k * I_L + l][i * O_L + j];
            }
            if (transpose == 1) {
                output_node[i][j] += input_node[k][l] * weight[i * O_L + j][k * I_L + l];
            }
        }

        output_node[i][j] += -1 * bias[i*O_L+j];

        //if( Math.random() < drop_out_rate ) targetNode[i][j] = 0;
        sum += output_node[i][j];
    }


    var average = sum / (O_L * O_L);
    var dev = 0;

    for (var i = 0; i < O_L; i++) for (var j = 0; j < O_L; j++) {
        dev += Math.pow(output_node[i][j] - average, 2);
    }

    var sd = Math.sqrt(dev / (O_L * O_L));

    for (var i = 0; i < O_L; i++) for (var j = 0; j < O_L; j++) {
        output_node[i][j] = sigmoid((output_node[i][j] - average) / sd);
    }

}


function calculate_errors(backward_errors,weight,errors,node_value,transpose){

    var B_L = backward_errors.length;
    var L = errors.length;

    var sum = 0;

    for (var i = 0; i < L ; i++) for (var j = 0; j < L ; j++) {

        for (var k = 0; k < B_L ; k++) for (var l = 0; l < B_L ; l++) {
            if(transpose == 0) {
                errors[i][j] = backward_errors[k][l] * weight[i * L + j][k * B_L + l];
            }
            if(transpose==1){
                errors[i][j] = backward_errors[k][l] * weight[k * B_L + l][i * L + j];
            }
        }
        sum += errors[i][j];

    }

    var average = sum / (L*L);
    var dev = 0;

    for (var i = 0; i < L; i++) for (var j = 0; j < L; j++) {
        dev += Math.pow(errors[i][j] - average , 2 ) ;
    }

    var sd = Math.sqrt( dev / (L*L) );

    for (var i = 0; i < L; i++) for (var j = 0; j < L; j++) {
        errors[i][j] = ((1 - node_value[i][j]) * node_value[i][j]) * (errors[i][j] - average)/sd ;

    }

}

function adjust_weight(Node,errors,weight,bias,transpose){

    var P_L= Node.length;
    var L= errors.length;

    for (var i = 0; i < P_L; i++) for (var j = 0; j < P_L; j++) {
        for (var k = 0; k < L; k++) for (var l = 0; l < L; l++) {
            if(transpose==0) {
                //weight[i * P_L + j][k * L + l] += Node[i][j] * errors[k][l] * learning_rate;
                if( errors[k][l] * weight[i * P_L + j][k * L + l] < 0) {

                    var x_distance = i - k*(P_L/L);
                    var y_distance = j - l*(P_L/L);
                    var distance = Math.sqrt(Math.pow(x_distance,2) + Math.pow(y_distance,2));

                    if(distance !== 0) {
                        weight[i * P_L + j][k * L + l] += Node[i][j] * errors[k][l] * learning_rate/distance;
                    }else{
                        weight[i * P_L + j][k * L + l] += Node[i][j] * errors[k][l] * learning_rate;
                    }
                }
            }
            if(transpose==1) {
                //weight[k * L + l][i * P_L + j] += Node[i][j] * errors[k][l] * learning_rate;
                if( errors[k][l] * weight[k * L + l][i * P_L + j] < 0) {

                    var x_distance = i - k*(P_L/L);
                    var y_distance = j - l*(P_L/L);
                    var distance = Math.sqrt(Math.pow(x_distance,2) + Math.pow(y_distance,2));
                    if(distance !== 0) {
                        weight[k * L + l][i * P_L + j] += Node[i][j] * errors[k][l] * learning_rate / distance;
                    }else{
                        weight[i * P_L + j][k * L + l] += Node[i][j] * errors[k][l] * learning_rate;
                    }
                }
            }
            if(i==0 && j==0){

                bias[i][j] += -1 * errors[k][l] * learning_rate;
            }
        }
    }
}

function autoencoder(){

    var canvas3_2 = document.getElementById('mycanvas');
    var context3_2 = canvas3_2.getContext('2d');
    context3_2.clearRect(0,0,canvas3_2.width,canvas3_2.height);

    var Layer_N = parseInt(document.getElementById("LAYER NUMBER").value);

    Layer_Node = new Array(Layer_N);

    learning_rate = parseFloat(document.getElementById("RATE").value);

    var MAX_ITERATION = parseInt(document.getElementById("MAX_ITE").value);

    for(var i = 0 ; i < Layer_Node.length ; i++ ) {

        //initialize(Layer_Node[i],parseInt(document.getElementsByName("LAYERS")[i].value));
        Layer_Node[i] = new Array(parseInt(document.getElementsByName("LAYERS")[i].value));
        for (var j = 0; j < Layer_Node[i].length; j++) {
            Layer_Node[i][j] = new Array(parseInt(document.getElementsByName("LAYERS")[i].value));
        }
    }


    w = new Array(Math.floor(Layer_N/2));

    for(var i=0;i< w.length;i++){
        w[i] = new Array(Layer_Node[i].length*Layer_Node[i].length);
        for(var j=0;j< w[i].length;j++){
            w[i][j] = new Array(Layer_Node[i+1].length*Layer_Node[i+1].length);
        }
    }


    var errors = new Array(Layer_N);

    for(var i=0;i<Layer_N;i++) {
        errors[i] = new Array(parseInt(document.getElementsByName("LAYERS")[i].value));
        for (var j = 0; j < errors[i].length; j++) {
            errors[i][j] = new Array(parseInt(document.getElementsByName("LAYERS")[i].value));
        }
    }



    for(var l=0;l< w.length;l++)for(var i=0;i<w[l].length;i++) for(var j=0;j<w[l][i].length;j++){

        var A = Math.sqrt(w[l].length);
        var B = Math.sqrt(w[l][i].length);

        //console.log(i % Math.sqrt(w[l].length),Math.floor(i / Math.sqrt(w[l].length)));
        var x_distance = i % A -
            Math.floor((j % B * (A / B )));
        var y_distance = Math.floor(i / A) -
            Math.floor( (j / B )*(A / B));
        var distance = Math.sqrt(Math.pow(x_distance,2) + Math.pow(y_distance,2));

        //Math.floor(i / Math.sqrt(w[l].length));

        distance = Math.sqrt(distance);

        //j % w[l][i].length;
        //j / w[l][i].length;
        //var temp = (Math.floor(Math.random()*2) == 0)? -1 : 1;
        temp = -1;

        w[l][i][j] = (distance !== 0)? temp * (1/(distance) ) : temp;

    }

    console.log(Math.sqrt(w[0][3][5]) );


    var drop_out_rate = 0.3;

    var bias_value = -1;
    var bias_w = new Array(Layer_N-1);

    for(var i=0;i<bias_w.length;i++){
        bias_w[i] = new Array(Layer_Node[i+1].length*Layer_Node[i+1].length);
        console.log(bias_w[i].length);
    }


    for(var i=0;i<bias_w.length;i++){
        for(var j=0;j<bias_w[i].length;j++){
            bias_w[i][j] = 0;
        }
    }

    initialize(Layer_Node);
    initialize(errors);

    for(var i=0;i<W;i++) for(var j=0;j<H;j++) {
        Layer_Node[0][i][j] = sd_image[selected_picture][i][j];

    }




    for(var it=0;it<MAX_ITERATION;it++) {

        //context3_2.clearRect(0,0,canvas3_2.width,canvas3_2.height);

        //feedforward

        for ( var i = 0 ; i < Layer_Node.length-1 ; i++ ){

            var t = ( i < Layer_Node.length/2 - 1 )? 0 : 1 ;
            if(t==0) feedforward(Layer_Node[i], Layer_Node[i+1], w[i], bias_w[i], t);
            if(t==1) feedforward(Layer_Node[i], Layer_Node[i+1], w[Layer_N-2-i], bias_w[i], t);

        }


        if ( it == MAX_ITERATION - 1 ) {
            var F_W = Layer_Node[Layer_N-1].length;
            var F_H = Layer_Node[Layer_N-1][0].length;

            for (var j = 0; j < F_W; j++) for (var i = 0; i < F_H; i++) {

                context3_2.fillStyle = 'rgba(' + Math.ceil(Layer_Node[Layer_N-1][j][i] * 255) + ',' +
                Math.ceil(Layer_Node[Layer_N-1][j][i] * 255) + ',' + Math.ceil(Layer_Node[Layer_N-1][j][i] * 255) + ',' + 1.0 + ')';

                context3_2.fillRect(i * (canvas3_2.width / F_W), j * (canvas3_2.height / F_H), canvas3_2.width / F_W, canvas3_2.height / F_H);

            }
        }



        //calculate_error

        for (var i = 0; i < errors[Layer_N-1].length; i++) for (var j = 0; j < errors[Layer_N-1][i].length; j++) {
            errors[Layer_N-1][i][j] = (sd_image[selected_picture][i][j] - Layer_Node[Layer_N-1][i][j])*(1 - Layer_Node[Layer_N-1][i][j]) * Layer_Node[Layer_N-1][i][j];
        }


        for(var i=0;i<Layer_N-1;i++) {

            var t = ( i < Layer_Node.length/2 - 1 )? 1 : 0 ;
            if(t==1) calculate_errors(errors[Layer_N-i-1], w[i], errors[Layer_N-i-2], Layer_Node[Layer_N-i-2], t);
            if(t==0) calculate_errors(errors[Layer_N-i-1], w[Layer_N-2-i], errors[Layer_N-i-2], Layer_Node[Layer_N-i-2], t);


        }

        //adjust weight

        for(var i=0;i<Layer_N-1;i++) {

            var t = ( i < Layer_Node.length/2 - 1 )? 0 : 1 ;
            if(t==0) adjust_weight(Layer_Node[i], errors[i+1], w[i], bias_w[i], t);
            if(t==1) adjust_weight(Layer_Node[i], errors[i+1], w[Layer_N-2-i], bias_w[i], t);


        }

        //error check

        var error = 0;

        for (var i = 0; i < W; i++) for (var j = 0; j < H; j++) {

            error += 0.5 * Math.pow(Layer_Node[Layer_N-1][i][j]- sd_image[selected_picture][i][j] , 2);

        }
        console.log("error", error);
        document.getElementById("error").innerHTML = "Error: "+error;

    }
    console.log("error", error);

}


function see_hidden_node(){

    console.log(document.getElementById("bb").value,document.getElementById("bb").selectedIndex);

    var s = parseInt(document.getElementById("bb").selectedIndex);

    var L = Layer_Node[s].length;

    var canvas3_2 = document.getElementById('mycanvas');
    var context3_2 = canvas3_2.getContext('2d');
    context3_2.clearRect(0,0,canvas3_2.width,canvas3_2.height);

    for (var j = 0; j < L; j++) for (var i = 0; i < L; i++) {

        context3_2.fillStyle = 'rgba(' + Math.ceil(Layer_Node[s][j][i] * 255) + ',' +
        Math.ceil(Layer_Node[s][j][i] * 255) + ',' + Math.ceil(Layer_Node[s][j][i] * 255) + ',' + 1.0 + ')';

        context3_2.fillRect(i * (canvas3_2.width / L ), j * (canvas3_2.height / L ),
            canvas3_2.width / L , canvas3_2.height / L );

    }
}

function see_weight(){

    var canvas3_2 = document.getElementById('mycanvas');
    var context3_2 = canvas3_2.getContext('2d');
    context3_2.clearRect(0,0,canvas3_2.width,canvas3_2.height);

    var a=Math.floor(Math.random()*w.length);
    var b=Math.floor(Math.random()*w[a][0].length);

    var temp = new Array(Math.sqrt(w[a][0].length));
    for(var i=0;i<temp.length;i++){
        temp[i] = new Array(Math.sqrt(w[a][0].length));
    }


    for(var i=0;i<temp.length;i++)for(var j=0;j<temp[i].length;j++) {
        temp[i][j] = (w[a][b][i*temp.length+j]+1.0)*0.5;
    }

    for(var i=0;i<temp.length;i++)for(var j=0;j<temp[i].length;j++) {
        context3_2.fillStyle = 'rgba(' + Math.ceil(temp[i][j] * 255) + ',' +
        Math.ceil(temp[i][j] * 255) + ',' + Math.ceil(temp[i][j] * 255) + ',' + 1.0 + ')';
        context3_2.fillRect(i*(canvas3_2.width / temp.length ), j * (canvas3_2.height / temp[i].length ),
            canvas3_2.width / temp.length, canvas3_2.height / temp[i].length);
    }

    console.log(temp[1][1]);
}

function see_original_image(){

    var canvas3_2 = document.getElementById('mycanvas');
    var context3_2 = canvas3_2.getContext('2d');
    context3_2.clearRect(0,0,canvas3_2.width,canvas3_2.height);

    for (var j = 0; j < W ; j++) for (var i = 0; i < H ; i++) {

        context3_2.fillStyle = 'rgba(' + Math.ceil(Layer_Node[0][j][i] * 255) + ',' +
        Math.ceil(Layer_Node[0][j][i] * 255) + ',' + Math.ceil(Layer_Node[0][j][i] * 255) + ',' + 1.0 + ')';

        context3_2.fillRect(i * (canvas3_2.width / W ), j * (canvas3_2.height / H ),
            canvas3_2.width / W , canvas3_2.height / H );
    }
}