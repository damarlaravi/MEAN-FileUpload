var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Grid = require('gridfs-stream');
var fs = require('fs');
var multer = require('multer');
var fileUpload = require('./controllers/fileUpload');
//var upload = multer({dest: "./server/uploads"});

app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/** Serving from the same express Server
 No cors required */
app.use(express.static('./client'));
app.use(bodyParser.json());

// DB Setup
// Bring Mongoose into the app
var mongoose = require('mongoose');

// Build the connection string
var dbURI = 'mongodb://localhost:27017/fileUpload';

// Create the database connection
mongoose.connect(dbURI);
var gfs;
Grid.mongo = mongoose.mongo;
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

//multers disk storage settings
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log("In Destination function", file);
        cb(null, './server/uploads/');
    },
    filename: function (req, file, cb) {
        //console.log("In filename function", file);
        var dateTimestamp = Date.now();
        cb(null, file.fieldname + '-' + dateTimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

//multer settings
var upload = multer({
    storage: storage
}).single('file');

//API path that will upload the files *!/
app.post('/upload', function (req, res) {
    //console.log(req.body);
    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({error_code: 0, err_desc: null});
    });
});


//app.post('/upload', fileUpload);
app.listen('3000', function () {
    console.log('running on 3000...');
});