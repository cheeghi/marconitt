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
var sendmail = require('sendmail')();


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
connection.connect();


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

app.get('/sendMail',function(req,res){
	sendmail({
	  from: 'marconiTT@marconivr.com',
	  to: 'fedrigo22@gmail.com',
	  replyTo: 'giuseppe.tanello@gmail.com',
	  subject: 'Email prova',
	  html: 'Questa è di prova'
	}, function (err, reply) {
	  console.log(err && err.stack)
	  console.dir(reply)
	});
	res.send("ok");
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


apiRoutes.post('/prenota', function(req, res) {
	var stanza = req.body.stanza;
	var giorno = req.body.giorno;
	var ora = req.body.ora;
	var risorsa = req.body.risorsa;
	var isClasse = (req.body.isclasse == "true");
    var user = req.body.user;

    if(isClasse) {
        isSchoolOur(giorno, stanza, ora, risorsa, function(response) {
            if(response) {
                addPrenotazione(giorno, stanza, ora, risorsa, user, true, function(response1) {
                    res.json(response1);
                });
            } else {
                addPrenotazione(giorno, stanza, ora, risorsa, user, false, function(response1) {
                    res.json(response1);
                });
            }
        });
    } else {
        addPrenotazione(giorno, stanza, ora, risorsa, user, false, function(response) {
            res.json(response);
        });
    }
});


apiRoutes.post('/approva', function(req, res) {
    var stanza = req.body.stanza;
	var giorno = req.body.giorno;
	var ora = req.body.ora;
    var id;

    selectId(giorno, stanza, ora, function(response) {
        id = response;
        var sql_stmt = "UPDATE prenotazioni SET approvata = True WHERE id = " + id;

        connection.query(sql_stmt, function(err) {
            if (!err) {
                res.json(true);
            } else {
                res.json(false);
            }
        });
    });
});


apiRoutes.post('/cancellaPrenotazione', function(req, res) {
    var stanza = req.body.stanza;
	var giorno = req.body.giorno;
	var ora = req.body.ora;
    var risorsa = req.body.risorsa;

    selectId(giorno, stanza, ora, function(response) {
        var id = response;
        sql_stmt = "SELECT isSchoolHour FROM prenotazioni WHERE id = " + id;

        connection.query(sql_stmt, function(err, rows, fields) {
            if (!err) {
                var isSOur = rows[0].isSchoolHour;

                if(isSOur) {
                    undoClasse(stanza, giorno, ora, risorsa, function(response2) {
                        if(response2) {
                            cancellaPrenotazione(stanza, giorno, ora, function(response1) {
                                res.json(response1);
                            })
                        } else {
                            res.json(false);
                        }
                    });
                } else {
                    cancellaPrenotazione(stanza, giorno, ora, function(response3) {
                        res.json(response3);
                    })
                }
            } else {
                res.json(false);
            }
        });
    });
});


apiRoutes.post('/creaEvento', function(req, res) {
    var giorno = req.body.giorno;
    var classi = req.body.classi;
    var stanze = req.body.stanze;

    //aggiungo nella tabella eventi.
    //seleziono l'id dell'evento.
    //ci collego i prof(vettore di professori).
    // VADO O NO A MODIFICARE LA TIMETABLE?? Metto un campo 'occupata' in risorsa.
    //Quando per il VISUALIZZA si trova 'occupata', va a prendere da tabella eventi.
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


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);


// =======================
// functions =============
// =======================


/*
 * Funzione che setta la risorsa nella timetable ed aggiunge la prenotazione nella timetable
 */
function addPrenotazione(giorno, stanza, ora, risorsa, who, èOraScuola, res) {
    var sql_stmt = "UPDATE timetable SET risorsa = '" + risorsa + "' WHERE stanza = '" +
        stanza + "' AND ora = " + ora + " AND giorno = '" + giorno + "';";

    connection.query(sql_stmt, function(err) {
        if (!err) {
            selectId(giorno, stanza, ora, function(id) {
                sql_stmt = "INSERT INTO prenotazioni VALUES(" + id + ", '" + who + "', " + èOraScuola + ", false);";
                connection.query(sql_stmt, function(err) {
                     if (!err) {
                        res(true);
                    } else {
                        res(false);
                    }
                });
            })
        } else {
            res(false);
        }
    });
}


/*
 * Funzione che ricerca e ritorna un id dalla timetable
 */
function  selectId(giorno, stanza, ora, res) {
    var sql_stmt = "SELECT id FROM timetable WHERE stanza = '" + stanza + "' AND ora = " + ora + " AND giorno = '" + giorno + "';";
    
    connection.query(sql_stmt, function(err, rows, fields) {
        if (!err) {
            res(rows[0].id);
        } else {
            res(false);
        }
    });
}


/*
 * Funzione che vede se la prenotazione per una classe è durante l'orario scolastico.
 * Se si, allora libera l'aula precedentemente occupata da tale classe.
 */
function isSchoolOur(giorno, stanza, ora, risorsa, res) {
    var sql_stmt = "SELECT giorno_settimana FROM timetable WHERE stanza = '" + stanza + "' AND giorno = '" 
        + giorno + "' AND ora = " + ora + ";";

    connection.query(sql_stmt, function(err, rows, fields) {
        if (!err) {
            var week_day = rows[0].giorno_settimana;
            sql_stmt = "SELECT `Column 4` AS oldStanza FROM GPU001 WHERE `Column 5` = " + week_day + " AND `Column 6` = '" 
                + ora + "' AND `Column 1` = '" + risorsa + "';";

            connection.query(sql_stmt, function(err, rows, fields) {
                if (!err) {
                    try {
                        var oldStanza = rows[0].oldStanza;
                        sql_stmt = "SELECT stanza FROM timetable WHERE ora = " + ora  + " AND  giorno = '" 
                            + giorno + "' AND risorsa = '" + risorsa + "';";

                        connection.query(sql_stmt, function(err, rows, fields) {
                            if (!err) {
                                try {
                                    var stanzaDaLib = rows[0].stanza;

                                    moveProfessori(stanza, stanzaDaLib, giorno, ora, function(resp) {
                                        if(resp) {
                                            liberaRisorse(stanzaDaLib, ora, giorno, function(response) {
                                                res(response);
                                            });
                                        } else {
                                            res(false);
                                        }
                                    })
                                } catch(e) {
                                    getProfFromOrario(stanza, giorno, ora, risorsa, function(resp) {
                                        if(resp == false) {
                                            res(false);
                                        } else {
                                            sql_stmt = resp;
                                            connection.query(sql_stmt, function(err) {
                                                if (!err) {
                                                    res(true);
                                                } else {
                                                    res(false);
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                res(false);
                            }
                        });
                    } catch(e) {
                        res(false);
                    }
                } else {
                    res(false);
                }
            });
        } else {
            res(false);
        }
    });
}


/*
 * Funzione che libera l'aula occupata da una determinata classe e dai professori ad essa associati.
 */
function liberaRisorse(stanza, ora, giorno, res) {
    var sql_stmt = "UPDATE timetable SET risorsa = Null, professore1 = Null, professore2 = Null, professoreS = Null " + 
        "WHERE stanza = '" + stanza + "' AND ora = " + ora + " AND giorno = '" + giorno + "';";

    connection.query(sql_stmt, function(err) {
        if (!err) {
            controllaPrenotazioni(stanza, giorno, ora, function(response) {
                res(response);
            });
        } else {
            res(false);
        }
    });
}


/*
 * Funzione che ritorna il professore1 dalla timetable in una determinata riga.
 */
function getProf1(stanza, giorno, ora, res) {
    var sql_stmt = "SELECT professore1 FROM timetable WHERE stanza = '" + stanza + "' AND giorno = '" 
        + giorno + "' AND ora = " + ora + ";";

    connection.query(sql_stmt, function(err, rows, fields) {
        if (!err) {
            var prof1 = rows[0].professore1;
            res(prof1);
        } else {
            res(false);
        }
    });
}


/*
 * Funzione che ritorna il professore2 dalla timetable in una determinata riga.
 */
function getProf2(stanza, giorno, ora, res) {
    var sql_stmt = "SELECT professore2 FROM timetable WHERE stanza = '" + stanza + "' AND giorno = '" 
        + giorno + "' AND ora = " + ora + ";";

    connection.query(sql_stmt, function(err, rows, fields) {
        if (!err) {
            var prof2 = rows[0].professore2;
            res(prof2);
        } else {
            res(false);
        }
    });
}


/*
 * Funzione che sposta i professori dalla loro aula a quella prenotata per la rispettiva classe.
 */
function moveProfessori(stanza, stanzaDaLib, giorno, ora, res) {
    getProf1(stanzaDaLib, giorno, ora, function(response1) {
        prof1 = response1;
        getProf2(stanzaDaLib, giorno, ora, function(response2) {
            prof2 = response2;
            var sql_stmt = "UPDATE timetable SET professore1 = '" + prof1 + "' WHERE ora = " + ora +
                " AND stanza = '" + stanza + "' AND giorno = '" + giorno + "';";

            connection.query(sql_stmt, function(err) {
                if (!err) {
                    var sql_stmt = "UPDATE timetable SET professore2 = '" + prof2 + "' WHERE ora = " + ora +
                        " AND stanza = '" + stanza + "' AND giorno = '" + giorno + "';";

                    connection.query(sql_stmt, function(err) {
                        if (!err) {
                            res(true);
                        } else {
                            res(false);
                        }
                    });
                } else {
                    res(false);
                }
            });
        });
    });
}


/*
 * Funzione che ritorna un codice sql per inserire i professori, presi dall'orario, nella timetable
 */
function getProfFromOrario(stanza, giorno, ora, risorsa, res) {
    var prof1;
    var prof2;
    console.log("A che sono finito qui");
    var sql_stmt = "SELECT giorno_settimana FROM timetable WHERE stanza = '" + stanza + "' AND giorno = '" 
        + giorno + "' AND ora = " + ora + ";";

    connection.query(sql_stmt, function(err, rows, fields) {
        if (!err) {
            var week_day = rows[0].giorno_settimana;

            sql_stmt = "SELECT `Column 2` AS prof FROM GPU001 WHERE `Column 5` = " + week_day + " AND `Column 6` = '" 
                + ora + "' AND `Column 1` = '" + risorsa + "';";

            connection.query(sql_stmt, function(err, rows1, fields) {
                if (!err) {
                    var p1 = rows1[0].prof;

                    try {
                        var p2 = rows1[1].prof;
                        sql_stmt = "SELECT `Column 1` AS nomeCognome FROM GPU004 WHERE `Column 0` = '" + p2 + "'";

                        connection.query(sql_stmt, function(err, rows, fields) {
                            if (!err) {
                                prof2 = rows[0].nomeCognome;
                                sql_stmt = "SELECT `Column 1` AS nomeCognome FROM GPU004 WHERE `Column 0` = '" + p1 + "'";

                                connection.query(sql_stmt, function(err, rows, fields) {
                                    if (!err) {
                                        prof1 = rows[0].nomeCognome;
                                        sql_stmt = "UPDATE timetable SET professore1 = '" + prof1 + "', professore2 = '" + prof2 +
                                            "' WHERE stanza = '" + stanza  + "' AND ora = " + ora + " AND giorno = '" + giorno + "'";
                                        res(sql_stmt);
                                    } else {
                                        res(false);
                                    }
                                });
                            } else {
                                res(false);
                            }
                        });
                    } catch(e) {
                        var prof2 = "Null";
                        sql_stmt = "SELECT `Column 1` AS nomeCognome FROM GPU004 WHERE `Column 0` = '" + p1 + "'";

                        connection.query(sql_stmt, function(err, rows, fields) {
                            if (!err) {
                                prof1 = rows[0].nomeCognome;
                                sql_stmt = "UPDATE timetable SET professore1 = '" + prof1 + "', professore2 = '" + prof2 +
                                    "' WHERE stanza = '" + stanza  + "' AND ora = " + ora + " AND giorno = '" + giorno + "'";
                                res(sql_stmt);
                            } else {
                                res(false);
                            }
                        });
                    }
                } else {
                    res(false);
                }
            });
        } else {
            res(false);
        }
    });
}


/*
 * Funzione che controlla se una prenotazione per una classe dovrebbe annullarne un'altra.
 * In caso positivo, cancella la prenotazione da annullare.
 */
function controllaPrenotazioni(stanza, giorno, ora, res) {
    sql_stmt = "SELECT id FROM timetable WHERE stanza = '" + stanza + "' AND giorno = '" + giorno + "' AND ora = " + ora + ";";

    connection.query(sql_stmt, function(err, rows, fields) {
        if (!err) {
            var id1 = rows[0].id;
            sql_stmt = "SELECT id FROM prenotazioni WHERE id = " + id1;

            connection.query(sql_stmt, function(err, rows, fields) {
                if(!err) {
                    try {
                        var id2 = rows[0].id;
                        sql_stmt = "DELETE FROM prenotazioni WHERE id = " + id2;
                        
                        connection.query(sql_stmt, function(err) {
                            if(!err) {
                                res(true);
                            } else {
                                res(false);
                            }
                        });
                    } catch(e) {
                        res(true);
                    }
                } else {
                    res(false);
                }
            });
        } else {
            res(false);
        }
    });
}


/*
 * Funzione che cancella una data prenotazione.
 */
function cancellaPrenotazione(stanza, giorno, ora, res) {
    var sql_stmt = "UPDATE timetable SET risorsa = Null, professore1 = Null, professore2 = Null, professoreS = Null " + 
        "WHERE stanza = '" + stanza + "' AND ora = " + ora + " AND giorno = '" + giorno + "';";

    connection.query(sql_stmt, function(err) {
        if(!err) {
            selectId(giorno, stanza, ora, function(id) {
                sql_stmt = "DELETE FROM prenotazioni WHERE id = " + id;

                connection.query(sql_stmt, function(err) {
                    if(!err) {
                        res(true);
                    } else {
                        res(false);
                    }
                });
            });
        } else {
            res(false);
        }
    });
}


/*
 * Funzione che fa tornare una classe nella sua stanza, secondo l'orario scolastico, se essa è libera
 * Altrimenti BISOGNA DECIDERE COSA FARE
 */
function undoClasse(stanza, giorno, ora, risorsa, res) {
    var sql_stmt = "SELECT giorno_settimana FROM timetable WHERE stanza = '" + stanza + "' AND giorno = '" 
        + giorno + "' AND ora = " + ora + ";";

    connection.query(sql_stmt, function(err, rows, fields) {
        if (!err) {
            var week_day = rows[0].giorno_settimana;

            sql_stmt = "SELECT `Column 4` AS stanzaOrario FROM GPU001 WHERE `Column 5` = " + week_day + " AND `Column 6` = '" 
                + ora + "' AND `Column 1` = '" + risorsa + "';";

            connection.query(sql_stmt, function(err, rows, fields) {
                if (!err) {
                    var stanzaOrario = rows[0].stanzaOrario;
                    sql_stmt = "SELECT risorsa FROM timetable WHERE stanza = '" +
                        stanzaOrario + "' AND ora = " + ora + " AND giorno = '" + giorno + "';";
                    
                    connection.query(sql_stmt, function(err, rows, fields) {
                        if (!err) {
                            classe = rows[0].risorsa;

                            if(classe != null) {
                                console.log("E' già occupata");
                                res(true);
                            } else {
                                var sql_stmt = "UPDATE timetable SET risorsa = '" + risorsa + "' WHERE stanza = '" +
                                    stanzaOrario + "' AND ora = " + ora + " AND giorno = '" + giorno + "';";

                                connection.query(sql_stmt, function(err) {
                                    if (!err) {
                                        moveProfessori(stanzaOrario, stanza, giorno, ora, function(response) {
                                            res(response);
                                        });
                                    } else {
                                        res(false);
                                    }
                                });
                            }
                        } else {
                            res(false);
                        }
                    });
                } else {
                    res(false);
                }
            });
        } else {
            res(false);
        }
    });
}