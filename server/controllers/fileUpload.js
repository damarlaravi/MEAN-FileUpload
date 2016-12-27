var multer = require('multer');
//var upload = require('../uploads/')
module.exports = function uploadAFile(req, res) {
    console.log('coming in calling');
    uploadFile(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({error_code: 0, err_desc: null});
    });
};

var uploadFile = multer({
    storage: storeFile
}).single('file');

var storeFile = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("In Destination function", file);
        cb(null, '../uploads/');
    },
    filename: function (req, file, cb) {
        console.log("In filename function", file);
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});