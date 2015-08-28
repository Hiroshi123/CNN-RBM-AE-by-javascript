/**
 * Created by hiroshi on 15/07/15.
 */
function send() {
        this.query = document.getElementById('query').value;
        this.pic_num = parseInt(document.getElementById('pic_num').value);
        console.log(this.pic_num);
        photo_search({ text: this.query,per_page:this.pic_num}
        );
}

function download(){
  var downloaded = document.createElement("p");
  downloaded.innerHTML="download had been done";
  var div = document.getElementById('photos_here');
  div.appendChild(downloaded);
}

// function for image search
function photo_search ( param ) {
    // my API key setting
    param.api_key  = '4df3beb87450502f86941ac88ee33756';
    param.method   = 'flickr.photos.search';
    //param.per_page = 10;
    param.sort     = 'interestingness-desc';
    param.format   = 'json';
    param.jsoncallback = 'jsonFlickrApi';
    param.safe_search = 3;

    // API request generation
    var url = 'https://www.flickr.com/services/rest/?'+
        obj2query( param );

    // screate script
    var script  = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.src  = url;
    document.body.appendChild( script );
};

// clear current display
function remove_children ( id ) {
    var div = document.getElementById( id );
    while ( div.firstChild ) {
        div.removeChild( div.lastChild );
    }
};

//generate query from object
function obj2query ( obj ) {
    var list = [];
    for( var key in obj ) {
        var k = encodeURIComponent(key);
        var v = encodeURIComponent(obj[key]);
        list[list.length] = k+'='+v;
    }
    var query = list.join( '&' );
    return query;
}

// call back after Flickr search
function jsonFlickrApi ( data ) {
    // データが取得できているかチェック
    if (!data) return;
    if (!data.photos) return;
    var list = data.photos.photo;
    if (!list) return;
    if (!list.length) return;


    remove_children('photos_here');

    var div = document.getElementById('photos_here');

    var t = 0;
    images = [];

    for (var i = 0; i < list.length; i++) {
        var photo = list[i];

        console.log(photo);

        // a element generation
        var atag = document.createElement('a');
        atag.href = 'http://www.flickr.com/photos/' +
        photo.owner + '/' + photo.id + '/';

        var cb = document.createElement('input');
        cb.setAttribute('type','checkbox');
        cb.setAttribute('name','picture');
        cb.setAttribute('checked','checked');
        //cb.innerHTML="download";
        // img generation
        images[i] = document.createElement('img');
        images[i].src = 'http://static.flickr.com/' + photo.server +
        '/' + photo.id + '_' + photo.secret + document.getElementById('size').value;
        images[i].style.border = '0'; 
        cb.setAttribute('value',images[i].src);
        atag.appendChild(images[i]);
        div.appendChild(atag);
        div.appendChild(cb);
        console.log(images[i]);
    }
}