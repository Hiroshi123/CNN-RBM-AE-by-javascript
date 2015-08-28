/**
 * Created by hiroshi on 08/06/15.
 */

//window.onload = function(){
function prepare_boltzmann(){

    test_alles = false;

    console.log("tanh!",Math.tanh(-1));
    input_node = new Array(W);
    output_node = new Array(W);
    for(var i=0;i<input_node.length;i++){
        input_node[i] = new Array(H);
        output_node[i] = new Array(H);
    }

    w = new Array(W*H);
    hidden_num = parseInt(document.getElementById("hidden_num").value);
    for(var i=0;i< w.length;i++){
        w[i] = new Array(hidden_num*hidden_num);
    }

    for(var i=0;i< w.length;i++) for(var j=0;j< w[i].length;j++){
        w[i][j] = Math.random()*2-1;
    }

    hidden_node1 = new Array(hidden_num);
    hidden_node2 = new Array(hidden_num);
    for(var i=0;i<hidden_num;i++){
        hidden_node1[i] = new Array(hidden_num);
        hidden_node2[i] = new Array(hidden_num);
    }

    vias_hidden = new Array(hidden_num);
    for(var i=0;i<hidden_num;i++){
        vias_hidden[i] = new Array(hidden_num);
    }
    vias_input = new Array(W);
    for(var i=0;i<W;i++){
        vias_input[i] = new Array(H);
    }
    for(var i=0;i<hidden_num;i++)for(var j=0;j<hidden_num;j++) {
        vias_hidden[i][j] = 0;
    }
    for(var i=0;i<W;i++)for(var j=0;j<H;j++) {
        vias_input[i][j] = 0;
    }

    picture_array = new Array(100);

    pic_count = 0;

    var select = document.getElementById('picture_num');

    var num_array = new Array(srcs.length);
    for(var i=0;i<num_array.length;i++) num_array[i] = i;

    console.log(num_array[0]);

    for ( var i in num_array ) {
        var option = document.createElement('option');
        //option.setAttribute('value', i);
        option.innerHTML = num_array[i]+1;
        select.appendChild(option);
    }
    var select = document.getElementById('test_value');
    for ( var i in num_array ) {
        var option = document.createElement('option');
        //option.setAttribute('value', i);
        option.innerHTML = num_array[i]+1;
        select.appendChild(option);
    }

};


function RBM(){

    var canvas1_1 = document.getElementById('canvas1_1');
    var context1_1 = canvas1_1.getContext('2d');


    for (var j = 0; j < W; j++) for (var i = 0; i < H; i++) {

        context1_1.fillStyle = 'rgba(' + Math.ceil(sd_image[picture_array[pic_count]][i][j] * 255) + ',' +
        Math.ceil(sd_image[picture_array[pic_count]][i][j] * 255) + ',' + Math.ceil(sd_image[picture_array[pic_count]][i][j] * 255) + ',' + 1.0 + ')';
        context1_1.fillRect((j) + pic_count*W, i, 1, 1);
    }


    var canvas2 = document.getElementById('canvas2');
    var context2 = canvas2.getContext('2d');
    context2.clearRect(0,0,canvas2.width,canvas2.height);

    var learning_rate = parseFloat(document.getElementById("RBM_RATE").value);
    var iteration = parseInt(document.getElementById("RBM_ITE").value);

    //var p = pic_count;
    pic_count += 1;

    console.log("e",sd_image[picture_array[0]][2][2]);


    for(var ITE=0;ITE<iteration;ITE++) {

        for(var p=0;p<pic_count;p++) {

            for (var i = 0; i < W; i++) for (var j = 0; j < H; j++) {
                input_node[i][j] = sd_image[picture_array[p]][i][j];
            }

            //feed forward

            for (var f = 0; f < hidden_num; f++) for (var g = 0; g < hidden_num; g++) {
                hidden_node1[f][g] = 0;
                for (var i = 0; i < W; i++) for (var j = 0; j < H; j++) {
                    hidden_node1[f][g] += input_node[i][j] * w[i * W + j][f * hidden_num + g];
                }
                hidden_node1[f][g] += -1 * vias_hidden[f][g];
                hidden_node1[f][g] = sigmoid(hidden_node1[f][g]);
                //hidden_node1[f][g] = (hidden_node1[f][g] < Math.random()) ? 0 : 1;
            }
            //feedback

            for (var f = 0; f < W; f++) for (var g = 0; g < H; g++) {
                input_node[f][g] = 0;
                for (var i = 0; i < hidden_num; i++) for (var j = 0; j < hidden_num; j++) {
                    input_node[f][g] += hidden_node1[i][j] * w[f * W + g][i * hidden_num + j];
                }
                input_node[f][g] += -1 * vias_input[f][g];
                input_node[f][g] = sigmoid(input_node[f][g]);
                //input_node[f][g] = (input_node[f][g] < Math.random()) ? 0 : 1;
            }

            //re feed forward

            for (var f = 0; f < hidden_num; f++) for (var g = 0; g < hidden_num; g++) {
                hidden_node2[f][g] = 0;
                for (var i = 0; i < W; i++) for (var j = 0; j < H; j++) {
                    hidden_node2[f][g] += input_node[i][j] * w[i * W + j][f * hidden_num + g];
                }
                hidden_node2[f][g] += -1 * vias_hidden[f][g];
                hidden_node2[f][g] = sigmoid(hidden_node2[f][g]);
                //hidden_node2[f][g] = (hidden_node2[f][g] < Math.random())? 0:1;
            }

            var sum = 0;

            //adjust weight


            for (var f = 0; f < W; f++) for (var g = 0; g < H; g++) {
                for (var i = 0; i < hidden_num; i++) for (var j = 0; j < hidden_num; j++) {
                    //w[f * W + g][i * hidden_num + j] += Math.random()*2-1;
                    w[f * W + g][i * hidden_num + j] += learning_rate *
                    (sd_image[picture_array[p]][f][g] * hidden_node1[i][j] - input_node[f][g] * hidden_node2[i][j]);
                    if (f == 0 && j == 0) {
                        vias_hidden[i][j] -= learning_rate * (hidden_node1[i][j] - hidden_node2[i][j]);
                    }
                    sum += Math.abs(w[f * W + g][i * hidden_num + j]);
                }
                vias_input[f][g] -= learning_rate * (sd_image[picture_array[p]][f][g] - input_node[f][g]);
            }

            sum /= W * H * hidden_num * hidden_num;

            //cross_entropy

            for (var f = 0; f < hidden_num; f++) for (var g = 0; g < hidden_num; g++) {
                hidden_node1[f][g] = 0;
                for (var i = 0; i < W; i++) for (var j = 0; j < H; j++) {
                    hidden_node1[f][g] += sd_image[picture_array[p]][i][j] * w[i * W + j][f * hidden_num + g];
                }
                hidden_node1[f][g] += -1 * vias_hidden[f][g];
                hidden_node1[f][g] = sigmoid(hidden_node1[f][g]);
                //hidden_node1[f][g] = (hidden_node1[f][g] < Math.random()) ? 0 : 1;
            }

            for (var f = 0; f < W; f++) for (var g = 0; g < H; g++) {
                input_node[f][g] = 0;
                for (var i = 0; i < hidden_num; i++) for (var j = 0; j < hidden_num; j++) {
                    input_node[f][g] += hidden_node1[i][j] * w[f * W + g][i * hidden_num + j];
                }
                input_node[f][g] += -1 * vias_input[f][g];
                input_node[f][g] = sigmoid(input_node[f][g]);
                //input_node[f][g] = (input_node[f][g] < Math.random()) ? 0 : 1;
            }

            var cost = 0;

            for (var f = 0; f < W; f++) for (var g = 0; g < H; g++) {
                if (input_node[f][g] !== 0 && input_node[f][g] !== 1) {
                    cost += sd_image[picture_array[p]][f][g] * Math.log(input_node[f][g]) +
                    (1 - sd_image[picture_array[p]][f][g]) * Math.log(1 - input_node[f][g]);
                }
            }
        }
            cost /= W;
            console.log("cost", cost);
        console.log(sum);
    }


    for(var i=0;i<input_node.length;i++) for(var j=0;j<input_node[0].length;j++) {
        context2.fillStyle = 'rgba(' + Math.ceil(input_node[j][i] * 255) + ',' +
        Math.ceil(input_node[j][i] * 255) + ',' + Math.ceil(input_node[j][i] * 255) + ',' + 1.0 + ')';
        context2.fillRect(i * (canvas2.width / W ), j * (canvas2.height / H ),
            canvas2.width / W , canvas2.height / H );
    }

    for(var i=0;i<input_node.length;i++) for(var j=0;j<input_node[0].length;j++) {
        context1_1.fillStyle = 'rgba(' + Math.ceil(input_node[j][i] * 255) + ',' +
        Math.ceil(input_node[j][i] * 255) + ',' + Math.ceil(input_node[j][i] * 255) + ',' + 1.0 + ')';
        context1_1.fillRect((i) + (pic_count-1)*W, j+H, 1, 1);
        //context1_1.fillRect(i * (canvas1_1.width / W ), j * (canvas1_1.height / H ),
            //canvas1_1.width / W , canvas1_1.height / H );
    }



    console.log(input_node.length,input_node[0].length);
}


function see_weight(){

    var canvas2 = document.getElementById('canvas2');
    var context2 = canvas2.getContext('2d');
    context2.clearRect(0,0,canvas2.width,canvas2.height);
    for (var f = 0; f < hidden_num; f++) for (var g = 0; g < hidden_num; g++) {
        context2.fillStyle = 'rgba(' + Math.ceil(sigmoid(w[0][f*hidden_num+g]) * 255) + ',' +
        Math.ceil(sigmoid(w[0][f*hidden_num+g]) * 255) + ',' + Math.ceil(sigmoid(w[0][f*hidden_num+g]) * 255) + ',' + 1.0 + ')';
        context2.fillRect(g * (canvas2.width / hidden_num ), f * (canvas2.height / hidden_num ),
            canvas2.width / hidden_num , canvas2.height / hidden_num );
    }
}


function check_hidden_node(){

    var canvas2 = document.getElementById('canvas2');
    var context2 = canvas2.getContext('2d');
    context2.clearRect(0,0,canvas2.width,canvas2.height);

    for(var i=0;i<hidden_node1.length;i++) for(var j=0;j<hidden_node1[0].length;j++) {
        context2.fillStyle = 'rgba(' + Math.ceil(hidden_node1[j][i] * 255) + ',' +
        Math.ceil(hidden_node1[j][i] * 255) + ',' + Math.ceil(hidden_node1[j][i] * 255) + ',' + 1.0 + ')';
        context2.fillRect(i * (canvas2.width / hidden_node1.length ), j * (canvas2.height / hidden_node1[0].length ),
            canvas2.width / hidden_node1.length , canvas2.height / hidden_node1[0].length );
    }
}

function test(value){

    var canvas2 = document.getElementById('canvas2');
    var context2 = canvas2.getContext('2d');
    context2.clearRect(0,0,canvas2.width,canvas2.height);

    if(test_alles == false) {
        var s = parseInt(document.getElementById("test_value").value) - 1;
    }else{
        var s = value;
    }
    console.log(s);

    //feed forward

    for (var f = 0; f < hidden_num; f++) for (var g = 0; g < hidden_num; g++) {
        hidden_node1[f][g] = 0;
        for (var i = 0; i < W; i++) for (var j = 0; j < H; j++) {
            hidden_node1[f][g] += sd_image[s][i][j] * w[i * W + j][f * hidden_num + g];
        }
        hidden_node1[f][g] = sigmoid(hidden_node1[f][g]);

        //hidden_node1[f][g] = (hidden_node1[f][g] < Math.random()) ? 0 : 1;

    }

    //feedback

    for (var f = 0; f < W; f++) for (var g = 0; g < H; g++) {
        input_node[f][g] = 0;
        for (var i = 0; i < hidden_num; i++) for (var j = 0; j < hidden_num; j++) {
            input_node[f][g] += hidden_node1[i][j] * w[f * W + g][i * hidden_num + j];
        }
        input_node[f][g] = sigmoid(input_node[f][g]);
        //input_node[f][g] = (input_node[f][g] < Math.random()) ? 0 : 1;
    }

    //display

    for(var i=0;i<input_node.length;i++) for(var j=0;j<input_node[0].length;j++) {
        context2.fillStyle = 'rgba(' + Math.ceil(input_node[j][i] * 255) + ',' +
        Math.ceil(input_node[j][i] * 255) + ',' + Math.ceil(input_node[j][i] * 255) + ',' + 1.0 + ')';
        context2.fillRect(i * (canvas2.width / W ), j * (canvas2.height / H ),
            canvas2.width / W , canvas2.height / H );
    }
    if(test_alles==true) {
        var canvas1_2 = document.getElementById('canvas1_2');
        var context1_2 = canvas1_2.getContext('2d');
        for(var i=0;i<input_node.length;i++) for(var j=0;j<input_node[0].length;j++) {
            context1_2.fillStyle = 'rgba(' + Math.ceil(input_node[j][i] * 255) + ',' +
            Math.ceil(input_node[j][i] * 255) + ',' + Math.ceil(input_node[j][i] * 255) + ',' + 1.0 + ')';
            context1_2.fillRect((i) + s*W, j+H, 1, 1);
        }
    }
}


function test_all(){
    var canvas1_2 = document.getElementById('canvas1_2');
    var context1_2 = canvas1_2.getContext('2d');

    test_alles = true;

    for(var k=0;k<srcs.length;k++) {
        for (var j = 0; j < W; j++) for (var i = 0; i < H; i++) {
            context1_2.fillStyle = 'rgba(' + Math.ceil(sd_image[k][j][i] * 255) + ',' +
            Math.ceil(sd_image[k][j][i] * 255) + ',' + Math.ceil(sd_image[k][j][i] * 255) + ',' + 1.0 + ')';
            context1_2.fillRect((i) + k*W, j, 1, 1);
        }
        test(k);
    }
    test_alles = false;
}


function picture_select(){

    var e = document.getElementById('picture_num');

    picture_array[pic_count] = parseInt(e.selectedIndex)-1;

    console.log(pic_count,picture_array[pic_count]);

    var canvas1 = document.getElementById('canvas1');
    var context1 = canvas1.getContext('2d');

    var column = Math.floor(picture_array[pic_count]*W/canvas1.width);
    var row = picture_array[pic_count]*W%canvas1.width;

    context1.lineWidth = 6;
    context1.strokeStyle = '#CCCCCC';
    context1.strokeRect(this.pre_row,this.pre_column*H,W,H);
    context1.lineWidth = 5;
    context1.strokeStyle = '#FF0000';
    context1.strokeRect(row,column*H,W,H);

    this.pre_column = column;

    this.pre_row = row;

}