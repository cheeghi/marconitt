// =======================
// get the packages we need ============
// =======================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var http = require('http');
var Converter = require("csvtojson").Converter;
var session = require('express-session');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config_default'); // get our config file
var User = require('./app/models/user');
var Day = require('./app/models/day');
var Who = require('./app/models/who');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('secret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/web'));

//connection to mysql database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database : 'marconitt'
});

// session management setup
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------
// we'll get to these in a second

app.get('/setup', function(req, res) {

    User.remove({},function(a) {});

    // create a sample user
    var nick = new User({ 
      name: '15932', 
      password: '123456--',
      admin: true 
    });

    // save the sample user
    nick.save(function(err) {
      if (err) throw err;

      console.log('User saved successfully');
      //res.json({ success: true });
    });

    var nick2 = new User({ 
      name: 'gb', 
      password: '123456--',
      admin: false 
    });

    // save the sample user
    nick2.save(function(err) {
      if (err) throw err;

      console.log('User saved successfully');
      res.json({ success: true });
    });

    Who.remove({},function(a) {});
    
    var gb = new Who({
      name: "Gianni Bellini",
      type: 1
    });
    gb.save(function(err,who) {
      if (err) throw err;

      console.log('User saved successfully '+who.id);
      //res.json({ success: true });
    });

     Day.remove({},function(a) {console.log("ok")});

    var d = new Day({
        description: "Test a maggio",
        hour_start: 12,
        hour_end: 12.15,
        type: 0,
        date: new Date(2016, 4, 26),
        who: ['5740ad60a543dc300f0d77b1']
    });

    d.save(function(err, day) {
        if (err) throw err;

        console.log('Day saved successfully ' + day.id);
        //res.json(day);
    });

    /*
      Day.find({date: new Date(2016,5,22)}, function(err, days) {
        var dd = days;
        dd.forEach(function(day) {
          day.who.forEach(function(w) {
            day.whos = [];
            Who.findById(w, function(err, ww) {
              console.log(ww);
              day.whos[day.whos.length] = ww;
            });
          })
        }); 
        console.log(dd);   
        res.json(dd);
      });

    */
});

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        name: req.body.name
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Utente non trovato.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Password errata.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('secret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                req.session.username = user.name;
                req.session.admin = user.admin;
                req.session.token = token;

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    username: req.session.username,
                    admin: user.admin
                });
            }

        }

    });
});


apiRoutes.get('/checklogin', function(req, res) {
    if (req.session.username) {
        res.json({
            success: true,
            username: req.session.username,
            admin: req.session.admin,
            token: req.session.token
        });
    }
});


apiRoutes.get('/logout', function(req, res) {
    req.session.destroy();
});


// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});


apiRoutes.get('/who', function(req, res) {
    Who.find({}, function(err, whos) {
        res.json(whos);
    });
});


apiRoutes.get('/events/:year/:month', function(req, res) {
    var y = parseInt(req.params.year);
    var m = parseInt(req.params.month);
    var start = new Date(y, m, 1);
    var end = new Date(y, m + 1, 0);
    Day.find({ date: { $gte: start, $lt: end } }, function(err, events) {
        res.json(events);
    });
});


apiRoutes.get('/events/:year/:month/:day', function(req, res) {

    var day = new Date(parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day));

    Day.find({ date: day })
        .sort({hour_start: 'asc', hour_end: 'asc'})
        .populate('who')
        .exec(function(err, events) {
            res.json(events);
        })

});


apiRoutes.get('/who/insert', function(req, res) {
Who.remove({},function(a){});

var converter = new Converter({});
converter.fromFile("./alunni.csv",function(err,result){
  result.forEach(function(alunno){
    toSave = new Who({
        name: (alunno.cognome+" "+alunno.nome).toLowerCase().capitalize(),
        type: 4
    });
    toSave.save(function(err, d) {
        if (err) throw err;
    });
  })
});

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
  everyone = http.get({
    host: '88.149.220.222',
    path: '/orario/api.php?search=a'
  }, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);

            parsed.classes.forEach(function(classs) {
                  toSave = new Who({
                      name: classs.toLowerCase().capitalize(),
                      type: 2
                  });
                  toSave.save(function(err, d) {
                      if (err) throw err;
                  });
                });
            parsed.teachers.forEach(function(teacher) {
                  toSave = new Who({
                      name: teacher.toLowerCase().capitalize(),
                      type: 1
                  });
                  toSave.save(function(err, d) {
                      if (err) throw err;
                  });
                });
            parsed.rooms.forEach(function(room) {
                  toSave = new Who({
                      name: room.toLowerCase().capitalize(),
                      type: 3
                  });
                  toSave.save(function(err, d) {
                      if (err) throw err;
                  });
                });

            res.json({ success: true });
        });
  })

});

var salva = function(req,res,day) {
  console.log(day);
    events = http.get({
        host: 'vps226037.ovh.net',
        path: '/marconi-tt/agenda.php?data=' + day.getFullYear() + "-" + (day.getMonth()+1) + "-" + day.getDate()
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            Day.remove({ date: day, type: 1 }, function(a) {});
            
            // Data reception is done, do whatever with it!
            try {
              var parsed = JSON.parse(body);

              parsed.forEach(function(event) {
                var who = [];
                  Who.find({ $or: [{name: { $regex: new RegExp("^" + event.who[0].toLowerCase(), "i") }}, {name: { $regex: new RegExp("^" + event.who[1].toLowerCase(), "i") }}]  }).exec(function(err, w) {
                    if (w[0]) {
                      w.forEach(function(ww) {
                        who.push(ww._id);
                      })
                    } else {
                      who = [];
                    }
                    dayToSave = new Day({
                        date: day,
                        hour_start: parseFloat(event.hour_start.replace(':', '.')),
                        hour_end: parseFloat(event.hour_end.replace(':', '.')),
                        type: 1,
                        description: event.description,
                        who: who
                    });
                    dayToSave.save(function(err, d) {
                        if (err) console.log(err);
                        console.log(d);
                    });
                  });
              });
            } catch (e) {
              console.log(e);
              console.log(day);
            }

        });
    });
}


apiRoutes.get('/spaggiari', function(req,res) {
  var now = new Date();
  days = [];
  for (var d = new Date(2016, 3, 1); d <= now; d.setDate(d.getDate() + 1)) {
    //setTimeout(salva, 6000, req, res, d);
    days.push(new Date(d));
  }
  console.log(days);
  l = days.length;
  c = 0;
  var refreshId = setInterval(function() {
    if(c == l) clearInterval(refreshId);
    salva(req,res,days[c]);
    c += 1;
  }, 6000);
})


apiRoutes.get('/spaggiari/:year/:month/:day', function(req, res) {
    var day = new Date(parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day));
    salva(req,res,day);
    res.json({ success: true });
});


// route middleware to verify a token
// methods declared after this call require token has to be passed 
apiRoutes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //console.log(req.body);
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('secret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});


apiRoutes.post('/prenota', function(req, res1) {
	var stanza = req.body.stanza;
	var giorno = req.body.giorno;
	var ora = req.body.ora;
	var risorsa = req.body.risorsa;
	var isClasse = (req.body.isclasse == "true");
    var user = req.body.user;

    if(isClasse == true) {
        var appo = liberaRisorse(stanza, giorno, ora, risorsa, user, res1);
    } else {
        addPrenotazione(stanza, giorno, ora, risorsa, user, false);
        var sql_stmt = "UPDATE timetable SET risorsa = '" + risorsa + "' WHERE stanza = '" + stanza +
	        "' AND giorno = '" + giorno + "' AND ora = " + ora + ";";
        http.get("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt, function() {
            res1.json(true);
        });
    }
});


apiRoutes.post('/events/:year/:month/:day', function(req, res) {
    console.log(req.body);
    var day = new Day({
        date: new Date(parseInt(req.params.year), parseInt(req.params.month), parseInt(req.params.day)),
        hour_start: parseFloat(req.body.hour_start),
        hour_end: parseFloat(req.body.hour_end),
        type: 0,
        description: req.body.description,
        who: req.body.who.split(','),
        visible: req.body.visible
    });
    console.log(day);
    day.save(function(err, d) {
        if (err) throw err;

        console.log('Day saved successfully ' + d.id);
        res.json({ success: true });
    });
});


apiRoutes.post('/events/delete/:id', function(req, res) {
    Day.remove({_id: req.params.id}).exec(function(err,d) {
      if (err) {
        res.json(err);
      } else {
        res.json({success: true});
      }
    });
});


apiRoutes.post('/events/visibility/:id', function(req, res) {
    Day.update({_id: req.params.id}, { visible: req.body.visible }).exec(function(err,d) {
      if (err) {
        res.json(err);
      } else {
        res.json({success: true});
      }
    });
});


// =======================
// functions =============
// =======================


//Release resources that are not in use
function liberaRisorse(stanza, giorno, ora, risorsa, user, res1) {
    var id;
    var sql_stmt;
    var stanzaLib;
    var professore1;
    var professore2;

	addPrenotazione(stanza, giorno, ora, risorsa, user, true);
    sql_stmt = "SELECT stanza FROM timetable WHERE risorsa = '" + risorsa + "' AND giorno = '" + giorno + "' AND ora = " + ora + ";";
    http.get('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt, function(res) {
        //console.log('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt);
        var str = '';

        res.on('data', function (chunk) {
            str += chunk;
            stanzaLib = str;
        });

        res.on('end', function () {
            sql_stmt = "UPDATE timetable SET risorsa = Null WHERE stanza = " + stanzaLib + 
                " AND ora = " + ora + " AND giorno ='" + giorno + "';";
            controllaPrenotazione(stanzaLib, giorno, ora);
            http.get("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt);
            //console.log("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt);
            var sql_stmt = "UPDATE timetable SET risorsa = '" + risorsa + "' WHERE stanza = '" + stanza +
                "' AND giorno = '" + giorno + "' AND ora = " + ora + ";";
                                
            var a = http.get("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt, function(res) {
                //console.log('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt);
                var str = '';

                res.on('data', function (chunk) {
                    str += chunk; 
                });

                res.on('end', function () {
                    getProf1(stanza, giorno, ora, stanzaLib, function() {
                        console.log("Fatto il prof 1");
                    });
                    getProf2(stanza, giorno, ora, stanzaLib, res1, function() {
                        console.log("Fatto il prof 2");
                    });
                });
            });
		});
    });
}


//Select the professore1 field from the timetable
function getProf1(stanza, giorno, ora, stanzaDaLiberare) {
    var sql_stmt = "SELECT professore1 FROM timetable WHERE stanza = " + stanzaDaLiberare + " AND giorno = '" + giorno + "' AND ora = " + ora + ";";
    //console.log('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt);
    http.get('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt, function(res) {
		var str = '';

		res.on('data', function (chunk) {
			str += chunk; 
		});

		res.on('end', function () {
            //console.log(typeof str, str);
            sql_stmt = "UPDATE timetable SET professore1 = " + str + " WHERE stanza = '" 
                + stanza + "' AND giorno = '" + giorno + "' AND ora = " + ora + ";";
            
            http.get("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt, function() {
                //console.log("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt);
                sql_stmt = "UPDATE timetable SET professore1 = Null WHERE stanza = " 
                    + stanzaDaLiberare + " AND giorno = '" + giorno + "' AND ora = " + ora + ";";
                http.get("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt);
                //console.log("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt);
            });
        });
    });
}


//Select the professore2 field from the timetable
function getProf2(stanza, giorno, ora, stanzaDaLiberare, res1) {
    var sql_stmt = "SELECT professore2 FROM timetable WHERE stanza = " + stanzaDaLiberare + " AND giorno = '" 
        + giorno + "' AND ora = " + ora + ";";
    //console.log('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt);
    http.get('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt, function(res) {
		var str = '';

		res.on('data', function (chunk) {
			str += chunk; 
		});

		res.on('end', function () {
            //console.log(typeof str, str);
            sql_stmt = "UPDATE timetable SET professore2 = " + str + " WHERE stanza = '" 
                + stanza + "' AND giorno = '" + giorno + "' AND ora = " + ora;

            http.get("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt, function() {
                //console.log("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt);
                sql_stmt = "UPDATE timetable SET professore2 = Null WHERE stanza = " 
                    + stanzaDaLiberare + " AND giorno = " + giorno + " AND ora = " + ora;
                http.get("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt, function() {
                    //console.log("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt);
                    res1.json(true);
                });
            });
        });
    });
}

//Add the reservation into the prenotazioni table
function addPrenotazione(stanza, giorno, ora, risorsa, user, isClasse) {
    sql_stmt = "SELECT id FROM timetable WHERE stanza = '" + stanza + "' AND giorno = '" + giorno + "' AND ora = " + ora + ";";
	http.get('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt, function(res) {
        //console.log('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt);
		var str = '';

		res.on('data', function (chunk) {
			str += chunk; 
		});

		res.on('end', function () {
			var strbello = str.replace('"', '');
			var strbello2 = strbello.replace('"', '');			  
			id = Number(strbello2);

			sql_stmt = "INSERT INTO prenotazioni VALUES(" + id + ", '" + user + "', " + isClasse + ");";
            http.get("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt, function() {
                //console.log("http://marconitt.altervista.org/timetable.php?dochange=" + sql_stmt);
            });
        });
    });
}

function controllaPrenotazione(stanza, giorno, ora) {
    sql_stmt = "SELECT id FROM timetable WHERE stanza = " + stanza + " AND giorno = '" + giorno + "' AND ora = " + ora + ";";
    http.get('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt, function(res) {
        console.log(sql_stmt);
        var str = '';

		res.on('data', function (chunk) {
			str += chunk; 
		});

        res.on('end', function () {
            var strbello = str.replace('"', '');
			var strbello2 = strbello.replace('"', '');			  
			id = Number(strbello2);
            sql_stmt = "SELECT id FROM prenotazioni WHERE id = " + id;
            http.get('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt, function(res) {
                console.log('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt);
                var str = '';

                res.on('data', function (chunk) {
                    str += chunk; 
                });

                res.on('end', function () {
                    id = Number(str)

                    if(id != 0) {
                        sql_stmt = "DELETE FROM prenotazioni WHERE id = " + str;
                        http.get('http://marconitt.altervista.org/timetable.php?getindex=' + sql_stmt, function() {
                            console.log("Fatto");
                        });
                    }
                });
            });
        });
    });
}


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
