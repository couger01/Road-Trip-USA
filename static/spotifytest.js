function authorize_token() {
    $.ajax({
        url: "http://localhost:5000/spotify-api/token",
        contentType: "application/json",
        method: "POST"
    }).done(function(data) {resp = JSON.parse(data); find_artist_id(favBand['IA']); })
}

function find_artist_id(artist_name) {
    $.ajax({
        url: "http://localhost:5000/spotify-api/search",
        contentType: "application/json",
        method: "GET",
        headers: {"Authorization":"Bearer "+resp.access_token},
        data: {"q":artist_name,"type":"artist"}
    }).done(function(data) {resp2 = JSON.parse(data); artist_id = resp2.artists.items[0].id; generate_recommendations(artist_id);})
}

function generate_recommendations(artist_id) {
    $.ajax({
        url: "http://localhost:5000/spotify-api/recommendations",
        contentType: "application/json",
        method: "GET",
        headers: {"Authorization":"Bearer "+resp.access_token},
        data: {"seed_artists":artist_id}
    }).done(function(data) {resp3 = JSON.parse(data); generate_iframes()})
}

function generate_iframe(state) {
    let pl = document.getElementById("playlist")
    let ifr = document.getElementById("spot_iframe")
    ifr.src = "https://embed.spotify.com/?uri="+ favBand['IA'/*currentAddress[1]*/];
}

function authorize_user() {
    $.ajax({
        url: "http://localhost:5000/spotify-api/authorize",
        contentType: "application/json",
        method: "GET",
        data: {"scope":"playlist-modify-public","client_id":"fcadd706105f4f4db8e6c302db211d26","response_type":"code","redirect_uri":"http://localhost:5000/static/cookieform.html"}
    }).done(function(data) { resp4 = JSON.parse(data);})
}


function drawTable() {
    var tbl = document.getElementById("artist_table")
    for (item of resp.artists.items) {
        let tr = document.createElement('TR');
        let td = document.createElement('TD');
        let td2 = document.createElement('TD');
        td.innerHTML = item.name;
        if (item.images.length != 0) {
            td2_image = document.createElement('img');
            td2_image.src = item.images[0].url;
            td2.appendChild(td2_image);
        }
        tr.appendChild(td);
        tr.appendChild(td2);
        tbl.appendChild(tr);

    }
}

var resp;
var resp2;
var resp3;
var resp4;
var artist_id;

var favBand = {
"AK":"Ginger Kwan",
"AL":"The Civil Wars",
"AR":"Wiz Khalifa",
"AZ":"Linkin Park",
"CA":"Bonobo",
"CO":"The Naked And Famous",
"CT":"David Guetta",
"DE":"Rush",
"FL":"Rick Ross",
"GA":"Future",
"HI":"J Boog",
"IA":"spotify:user:12185101777:playlist:5tf9FWxu83AbfekxjX9v2H",
"ID":"Tegan and Sara",
"IL":"Sufjan Stevens",
"IN":"Blake Shelton",
"KS":"Eric Church",
"KY":"Fall Out Boy",
"LA":"Kevin Gates",
"MA":"Neil Young",
"MD":"Kelly Rowland",
"ME":"R.E.M.",
"MI":"Young Jeezy",
"MN":"spotify:user:12185101777:playlist:2hrqggJZm6uHKLJTv1Ncfm",
"MO":"The Shins",
"MS":"August Alsina",
"MT":"Tim McGraw",
"NC":"Miguel",
"ND":"Stone Sour",
"NE":"Bastille",
"NH":"Grateful Dead",
"NJ":"Bruce Springsteen",
"NM":"Alan Jackson",
"NV":"Ciara",
"NY":"James Blake",
"OH":"Florida Georgia Line",
"OK":"Jason Aldean",
"OR":"Kurt Vile",
"PA":"Edward Sharpe & the Magnetic Zeros",
"RI":"Nirvana",
"SC":"Hillsong United",
"SD":"Hinder",
"TN":"Juicy J",
"TX":"George Strait",
"UT":"AWOLNATION",
"VA":"Dave Matthews Band",
"VT":"Phish",
"WA":"The Head and the Heart",
"WI":"spotify:user:12185101777:playlist:7bi58x6V8uMeTUntcjsp42",
"WV":"matchbox twenty",
"WY":"Dirty Heads",
}
