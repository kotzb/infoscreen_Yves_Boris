const   express = require('express'),   // 1-7 import librarys
        http    = require('http'),
        fs      = require('fs'),
        path    = require('path'),
        parser  = require('body-parser'),
        mysql   = require('mysql');

const router = express.Router(); //api router definition
const app = express();
const port = 3000;
var pool = mysql.createPool({ //11-17 verbindung zu datenbank
    connectionLimit : 100,
    host            : 'localhost',
    user            : 'root',
    password        : 'MyRoot1#',
    database        : 'infoscreen'
});
app.use(express.static(path.join(__dirname, '/public')));
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());
app.get('/', function(req, res) {
    res.send('index');
})
app.get('/view/:view', function (req, res, next) {
    res.sendFile(path.join(__dirname, "views/" + req.params.view + ".html"));
});
app.get('/infoscreen/getMenu', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var query = 'SELECT * FROM menu WHERE day = ":date"';
    query = query.replace(":date", yyyy + "-" + mm + "-" + dd);
    pool.query(query, function (error, results, fields) {
        if (error) {
            status = false;
            console.log(error);
            return;
        } else {
            res.send(JSON.stringify(results))
        }
    });
});
app.get('/infoscreen/getTimetable', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var query = 'SELECT * FROM timetable WHERE day = ":date" ORDER BY start_time ASC';
    query = query.replace(":date", yyyy + "-" + mm + "-" + dd);
    pool.query(query, function (error, results, fields) {
        if (error) {
            status = false;
            console.log(error);
            return;
        } else {
            res.send(JSON.stringify(results))
        }
    });
});
app.post('/menu/add', function (req, res, next) {
    var query = 'INSERT INTO menu (day, name, ingredients) VALUES ("-day", ":class", ":ingredients")';
    for(const [key, value] of Object.entries(req.body)) {
        query = query.replace(":" + key, value);
    }
    var date = new Date(req.body.day);
    var y =  date.getFullYear();
    var m = date.getMonth() + 1;
    m = m.toString().length < 2 ? ("0" + m) : m;
    var d = date.getDate();
    var dateString = y + "-" + m + "-" + d;
    query = query.replace("-day", dateString);
    pool.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(false);
        } else {
            res.send(true);
        }
    });
});
app.post('/timetable/add', function (req, res, next) {
    var query = 'INSERT INTO `timetable` (`classroom`, `class`, `subject`, `start_time`, `end_time`, `teacher`, `day`) VALUES (":room", ":class", ":subject", ":start_time", ":end_time", ":teacher", "-day")';
    for(const [key, value] of Object.entries(req.body)) {
        query = query.replace(":" + key, value);
    }
    var date = new Date(req.body.day);
    var y =  date.getFullYear();
    var m = date.getMonth() + 1;
    m = m.toString().length < 2 ? ("0" + m) : m;
    var d = date.getDate();
    var dateString = y + "-" + m + "-" + d;
    query = query.replace("-day", dateString);
    pool.query(query, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(false);
        } else {
            res.send(true);
        }
    });
});
http.createServer(app).listen(port, function() {
    console.log("Server listening on port " + port)
});
