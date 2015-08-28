var express = require('express'),
    fs = require('fs'),
    app = express(),
    request = require('request');
    //rmdir = require('rimraf'),
    //async = require('async');

//abloished from node4
//app.use(app.router);
//app.use(express.logger('dev'));

//rendering html by ejs, this allows set html file connected to node.js server
app.engine('.html', require('ejs').renderFile);
app.set('views',__dirname);

app.set('view engine','html');

// middle ware to put all folders & files in the "public" folder on local environment
app.use(express.static('public'));

//middle ware to get the response from html
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

//the "index.html" file which is in the same layer of server.js is set as root file
//Connection from http://localhost:3000 returns index.html
app.get('/',function(req,res){
  res.render('index');
});


//download json and image file
//first check if the query is already existed in json,if not, add the new query

app.post('/image_set/set_picture.html', function(req,res,next){
  //res.setHeader('Content-Type','text/plain');
  console.dir(req.body);
  console.dir(req.body.query);
  console.dir(req.body.picture.length);
  var datas = [];
  var skip = false;
  text = fs.readFileSync('./public/image/log.json','utf8');
  console.dir(text);
  if(text!==''){
  var query_array = JSON.parse(text);
  for(var i=0;i<query_array.length;i++){
  console.dir(query_array[i].query);
  console.dir(req.body.query);
  if(req.body.query==query_array[i].query){
    skip = true;
    if(parseInt(query_array[i].number)<parseInt(req.body.picture.length)){
    console.dir("hi");
      datas.push({
    "query":query_array[i].query,
    "number":req.body.picture.length,
      })
  }else{
    datas.push({
    "query":query_array[i].query,
    "number":query_array[i].number, 
    })
  }
  }else{
    console.dir("pika!");
    datas.push({
      "query":query_array[i].query,
      "number":query_array[i].number,
  })
  }
  }
  }
  //var datas = [req.body.query,req.body.picture.length];
  if(!skip){
  datas.push({
    "query":req.body.query,
    "number":req.body.picture.length,
  })
  fs.writeFileSync('public/image/log.json', JSON.stringify(datas),'utf8');
  }
  for(var i=0;i<req.body.picture.length;i++){
    var fileUrl = req.body.picture[i];
    var ii=i+1;
    request
  .get(fileUrl)
  .on('response', function (res) {
    console.dir('statusCode: ', res.statusCode);
    console.dir('content-length: ', res.headers['content-length']);
  })
.pipe(fs.createWriteStream('./public/image/'+ req.body.query + ii + '.jpg'));
  }

});

//delete image folder and create it again to wipe all of the files in it
app.post('/image_set/database.html',function(req,res,next){
  deleteFolderRecursive('public/image/');
  fs.mkdirSync('public/image/');
  var datas = [];
  fs.writeFileSync('./public/image/log.json',JSON.stringify(datas),'utf8');
  app.set('views',__dirname+"/public/image_set/");
  res.render('database');
  app.set('views',__dirname);

});

//Since simple fs.rmdirSync(path) is not capable of deleting folder which is not empty,
//wiping all of the files is needed with following process
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

app.listen(3000);
console.log('server starting at http://localhost:3000');
