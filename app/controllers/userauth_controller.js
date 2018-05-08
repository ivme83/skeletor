const express       = require('express');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcryptjs');
const fs            = require('fs');
const exec          = require('child-process-promise').exec;
const EasyZip       = require('easy-zip').EasyZip;
const path          = require('path');
const rimraf        = require('rimraf');

const router        = express.Router();

const db            = require("../models");
const Sequelize     = require('sequelize');
const Op            = Sequelize.Op;


//===============ROUTES=================
//displays our homepage
router.get('/', function(req, res){
    // console.log(req.user);
    res.render('home', {user: req.user});
});

//displays our signup page
router.get('/signin', function(req, res){
    res.render('signin');
});

/* Handle Logout */
router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/dl', function(req, res) {
    // let file = path.join(__dirname, '../public/assets/deliverables/folderall.zip');
    // res.download(file, 'structure.zip');
    res.render('dl', {user: req.user});
});

router.get('/get-file', function(req, res){
    let file = path.join(__dirname, '../build/' + req.user.username + '/deliverables/structure.zip');
    res.download(file);
});

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/signin' }),
    function(req, res) {
    res.redirect('/');
});

router.post('/signup',
    passport.authenticate('signup', { failureRedirect: '/signin' }),
    function(req, res) {
    res.redirect('/');
});

router.post('/api/runCmd', function(req, res){
    let cmdStr = req.body.cmdStr;
    console.log("THIS IS THE REQ USER " + req.user);
    runCommand(cmdStr, req.user.username).then(function(value){
        res.send({redirect: '/dl'});
    });
});
 
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.user.findById(id).then(function(result){
        cb(null, result);
    });
});

passport.use('local', new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        db.user.findOne({where: {username: username}}).then(function(results) {
            // console.log(results);
            let user = JSON.parse(JSON.stringify(results));
            // console.log(user);
            if (!user) {
                return done(null, false);
            }

            let hash = user.password;
            
            bcrypt.compare(password, hash).then((res) => {
                if (res) {
                    console.log("SUCCESS");
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });

        }); 

    });

}));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
        db.user.findOne({where: {username: username}}).then(function(results) {
            
            let user = JSON.parse(JSON.stringify(results));

            if(user){
                console.log('User already exists');
                return done(null, false); 
            } else {
                genHash(password).then(hash => {
                    db.user.create({
                        username: username,
                        password: hash
                    })
                    .then(result => {
                        let user = JSON.parse(JSON.stringify(results));
                        console.log("THE CREATED USER " + user);
                        return done(null, user);
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                })

            }
        });   
    }

    process.nextTick(findOrCreateUser);
}));


let search = function(nameKey, nameValue, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][nameKey] === nameValue) {
            return myArray[i].snip_content;
        }
    }
}
  
let zipUp = function(dir, folderName, cb){
    let zip = new EasyZip();
    
    zip.zipFolder(dir, function(){

        let zipSave = 'app/build/' + folderName + '/deliverables/structure.zip';

        zip.writeToFile(zipSave, function(){
        console.log("ZIPPED!");
        cb(dir);
        });
    });
}

let runCommand = function(command, folderName) {
    return new Promise(function(resolve, reject) {

        if (!fs.existsSync('app/build/' + folderName + '/')){
            fs.mkdirSync('app/build/' + folderName + '/');
        }

        if (!fs.existsSync('app/build/' + folderName + '/temp/')){
            fs.mkdirSync('app/build/' + folderName + '/temp/');
        }

        if (!fs.existsSync('app/build/' + folderName + '/deliverables/')){
            fs.mkdirSync('app/build/' + folderName + '/deliverables/');
        }

        let currentWD = '\app/build/' + folderName + '/temp/';

        exec(command, {cwd: currentWD})
            .then(function (result) {
                var stdout = result.stdout;
                var stderr = result.stderr;
                console.log('stdout: ', stdout);
                console.log('stderr: ', stderr);

                zipUp('app/build/' + folderName + '/temp', folderName, function(dir){
                    rimraf(dir, function (){
                        console.log('done');
                        resolve("Success");
                    });
                });
            })
            .catch(function (err) {
                console.error('ERROR: ', err);
            });
    });
}

let genHash = function(password) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

// Export routes for server.js to use.
module.exports      = router;