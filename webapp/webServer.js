"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

// Project 7 requirements
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);
const bodyParser = require('body-parser');
const multer = require('multer');
var processFormBody = multer({
    storage: multer.memoryStorage()
}).single('uploadedphoto');
var fs = require('fs');
var cs142password = require('./cs142password.js');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
// var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

// Project 7 requirements usage 
app.use(session({
    secret: 'hopeThisQuarterEndsASAP',
    resave: false,
    saveUninitialized: false,
    user_id: undefined,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
}));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

// Currently logged in user
app.get('/admin/current', function(request, response) {
    let user_id = request.session.user_id;
    if (!user_id) {
      console.log('Invalid user id');
      response.status(200).send(undefined);
      return;
    }
    User.findOne({_id: user_id}, (_, user) => {
      if (!user) {
        console.log('Invalid user id');
        response.status(400).send('Invalid user id');
        return;
      }
      let {_id, first_name, last_name, login_name} = user;
      let new_user = {_id, first_name, last_name, login_name};
      response.status(200).send(new_user);
    });
  });

// Login user
app.post('/admin/login', function (request, response) {
    let login_info = request.body.login_name;
    let pwd = request.body.password;
    User.findOne({'login_name': login_info}, function (err, user) {
        if (err !== null) {
            console.log('Invalid login name');
            response.status(400).send('Invalid login name');
            return;
        } 
        if (user === null) {
            console.log('invalid user ID');
            response.status(400).send('Invalid User ID');
            return;
        } 
        var pwd_match = cs142password.doesPasswordMatch(user.password_digest, user.salt, pwd);
        if (!pwd_match) {
            response.status(400).send('Incorrect Password');
        } else {
            request.session.user_id = user._id;
            request.session.login_name = login_info;
            let {_id, first_name, last_name, login_name} = user;
            let new_user = {_id, first_name, last_name, login_name};
            response.status(200).send(new_user);
        }
    });
});

// Logout user
app.post('/admin/logout', function (request, response) {
    request.session.destroy(function (err) {
        if (err) {
            console.log('No user currently logged in');
            response.status(400).send('No user currently logged in');
            return;
        } else {
            response.status(200).send();
        }
    });
});

// Do not allow unpermitted users
app.get('/unpermittedUsers/list', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    let curr_user_id = request.session.user_id;
    User.find({}, (_, all_users) => {
        let new_users = all_users.filter(user => String(user._id) !== String(curr_user_id));
        async.eachOf(
            new_users, 
            function(user, idx, callback) {
                let {_id, first_name, last_name} = user;
                new_users[idx] = {_id, first_name, last_name};
                callback();
            },
            err => {
                if (err) {
                    console.log(err);
                } else {
                    response.status(200).send(new_users);
                }
            }
        );
    });
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    User.find({}, function(_, users) {
        let list_of_users = users;
        if (users.length === 0) {
            console.log('No users');
            response.status(400).send('No users');
            return;
        }
        async.eachOf(users, function(user, idx, callback) {
            let {_id, first_name, last_name} = user;
            list_of_users[idx] = {_id, first_name, last_name};
            callback();
        }, (err) => {
            if (err) {
                console.log('/user/list error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            else {
                response.status(200).send(list_of_users);
            }
        })
    });
});

// Get list of users to mention
app.get('/user/selectMentions', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    User.find({}, (_, users) => {
        let list_of_users = users;
        async.eachOf(
            users,
            function(user, idx, callback) {
                let {_id, first_name, last_name} = user;
                list_of_users[idx] = {id: _id, display: `${first_name} ${last_name}`};
                callback();
            },
            err => {
                if (err) {
                    console.log('/user/selectMentions error:', err);
                    response.status(400).send(JSON.stringify(err));
                    return;
                } else {
                    response.status(200).send(list_of_users);
                }
            }
        );
    });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    var id = request.params.id;
    User.findOne({_id: id}, (err, user) => {
        if (err) {
            console.log('User with _id:' + id + ' not found.');
            response.status(400).send('User with _id:' + id + ' not found.');
            return;
        }
        let {_id, first_name, last_name, location, description, occupation, mentioned} = user;
        let requested_user = {_id, first_name, last_name, location, description, occupation, mentioned};
        response.status(200).send(requested_user);
    });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    var id = request.params.id;
    Photo.find({user_id: id}, async function (err, photos) {
        if (err) {
            console.log('Photos for user with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        if (photos.length === 0) {
            console.log('Photos for user with _id:' + id + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        let requested_photos = JSON.parse(JSON.stringify(photos));
        async.eachOf(requested_photos, function(photo, i, photoCallback) {
            delete photo.__v;
            async.eachOf(photo.comments, function(comment, i, commentCallback) {
                let requestedUser = User.findOne({_id: comment.user_id}, (err) => {
                    if (err) {
                        console.log('Photos for user with _id:' + comment.user_id + ' not found.');
                        response.status(400).send('Not found');
                        return;
                    }
                });
                requestedUser.then((user) => {
                    let {_id, first_name, last_name} = user;
                    photo.comments[i] = {
                        comment: comment.comment,
                        date_time: comment.date_time,
                        _id: comment._id,
                        user: {
                            _id: _id,
                            first_name: first_name,
                            last_name: last_name
                        }
                    }
                    commentCallback();
                });
            }, (err) => {
                if (err) {
                    console.log('Photos for user with _id:' + id + ' not found.');
                    response.status(400).send('Not found');
                    return;
                } 
                requested_photos[i] = photo;
                photoCallback();
            })
        }, function (err) {
            if (err) {
                console.log('Photos for user with _id:' + id + ' not found.');
                response.status(400).send('Not found');
                return;
            }
            response.status(200).send(requested_photos);
        });
    });
});

// Photos with Mentions
app.get('/photosWithMentions/:photo_id', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    let photo_id = request.params.photo_id;
    Photo.findOne({_id: photo_id}, function(err, photo) {
        if (err) {
            response.status(400).send('Invalid photo ID');
            return;
        }
        User.findOne({_id: photo.user_id}, function(_, photo_owner) {
        let new_photo = {
            _id: photo_id,
            photo_owner_id: photo_owner._id,
            file_name: photo.file_name,
            photo_owner_first_name: photo_owner.first_name,
            photo_owner_last_name: photo_owner.last_name,
            users_permitted: photo.users_permitted
        };
        response.status(200).send(new_photo);
        });
    });
});

// Comments
app.post('/commentsOfPhoto/:photo_id', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    let photo_id = request.params.photo_id;
    let curr_user = request.session.user_id;
    let comment_text = request.body.comment;
    let mentions_to_add = request.body.mentions;
    if (!comment_text) {
        response.status(400).send('Comment is empty');
        return;
    }
    Photo.findOne({_id: photo_id}, function(err, photo) {
        if (err) {
            console.log('Photo with id:' + photo_id + ' not found.');
            response.status(400).send('Photo with id:' + photo_id + ' not found.');
            return;
        }
        let curr_date_time = new Date();
        photo.comments = photo.comments.concat([
            {comment: comment_text, date_time: curr_date_time, user_id: curr_user}
        ]);
        photo.save();
        async.each(
            mentions_to_add,
            function(user, callback) {
                User.findOne({_id: user}, function(err, user) {
                    if (err) {
                        console.log('User with _id:' + user + ' not found.');
                        response.status(400).send('User with _id:' + user + ' not found.');
                        return;
                    }
                    user.mentioned.push(photo_id);
                    user.save();
                    callback();
                });
            },
            function(err) {
                if (err) {
                    console.log('Could not add mentions');
                    response.status(400).send('Could not add mentions');
                    return;
                }
                response.status(200).send();
            }
        );
    });
});

// Add photo to favorites
app.post('/addFavorite', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    let user_id = request.session.user_id;
    let photo_id = request.body.photo_id;
    User.findOne({_id: user_id}, function(err, user) {
        if (err) {
            console.log('User with _id:' + user_id + ' not found.');
            response.status(400).send('User with _id:' + user_id + ' not found.');
            return;
        }
        if (!user.favorites.includes(photo_id)) {
            user.favorites.push(photo_id);
            user.save();
        }
        response.status(200).send();
    });
});

// Like or unlike photo
app.post('/likePhoto/:photo_id', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    let photo_id = request.params.photo_id;
    let user_id = request.session.user_id;
    Photo.findOne({_id: photo_id}, function(err, photo) {
        if (err) {
            console.log('Photo with id:' + photo_id + ' not found.');
            response.status(400).send('Photo with id:' + photo_id + ' not found.');
            return;
        }
        let user_idx = photo.liked_by.indexOf(user_id);
        if (request.body.like) {
            if (user_idx >= 0) {
                response.status(400).send('Photo already liked.');
                return;
            }
            photo.liked_by.push(user_id);
        } else {
            if (user_idx == -1) {
                response.status(400).send('Photo not liked yet.');
                return;
            }
            photo.liked_by.splice(user_idx, 1);
        }
        photo.save();
        response.status(200).send();
    });
});

// Remove photo from favorites
app.get('/removeFavorite/:photo_id', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    let photo_id = request.params.photo_id;
    let user_id = request.session.user_id;
    User.findOne({_id: user_id}, function(err, user) {
        if (err) {
            console.log('User with _id:' + user_id + ' not found.');
            response.status(400).send('User with _id:' + user_id + ' not found.');
            return;
        }
        const photo_idx = user.favorites.indexOf(photo_id);
        user.favorites.splice(photo_idx, 1);
        user.save();
        response.status(200).send();
    });
});

// Add tag to photo
app.post('/addTag/:photo_id', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    let photo_id = request.params.photo_id;
    let photo_tag = request.body;
    Photo.findOne({_id: photo_id}, function(err, photo) {
        if (err) {
            console.log('Photo with id:' + photo_id + ' not found.');
            response.status(400).send('Photo with id:' + photo_id + ' not found.');
            return;
        }
        photo.tags.push(photo_tag);
        photo.save();
        response.status(200).send();
    });
});

// Get favorited photos
app.get('/getFavorites', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    let user_id = request.session.user_id;
    User.findOne({_id: user_id}, function(err, user) {
        if (err) {
            console.log('User with _id:' + user_id + ' not found.');
            response.status(400).send('User with _id:' + user_id + ' not found.');
            return;
        }
        let user_favorites = user.favorites;
        let favorites = [];
        async.each(
            user_favorites,
            (photo_id, callback) => {
                Photo.findOne({_id: photo_id}, function(err, photo) {
                    if (err) {
                        console.log('Photo with id:' + photo_id + ' not found.');
                        response.status(400).send('Photo with id:' + photo_id + ' not found.');
                        return;
                    }
                    favorites.push({
                        file_name: photo.file_name,
                        date_time: photo.date_time,
                        _id: photo._id
                    });
                    callback();
                });
            },
            function(err) {
            if (err) {
                response.status(400).send('No favorites yet.');
                return;
            }
            response.status(200).send(favorites);
            }
        );
    });
});

// New photos
app.post('/photos/new', function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send('User not logged in');
        return;
    }
    processFormBody(request, response, function(err) {
        if (err || !request.file) {
                console.log('Invalid file');
                response.status(400).send('Invalid file');
                return;
        }
        let user_permissions = JSON.parse(request.body.usersPermissed);
        var timestamp = new Date().valueOf();
        var filename = 'U' + String(timestamp) + request.file.originalname;
        fs.writeFile('./images/' + filename, request.file.buffer, function(err) {
            if (err) {
                console.log('Cannot write file');
                response.status(400).send('Cannot write file');
                return;
            }
            let users_permitted = Object.entries(user_permissions).filter((key_value) => key_value[1]).map((key_value) => key_value[0]);
            users_permitted.push(request.session.user_id);
            Photo.create({
                file_name: filename,
                date_time: timestamp,
                user_id: request.session.user_id,
                comments: [],
                tags: [],
                users_permitted,
                },
                function(err, newPhoto) {
                    if (err) {
                        console.log('Cannot create photo');
                        response.status(400).send('Cannot create photo');
                        return;
                    }
                    newPhoto.save();
                    response.status(200).send();
                }
            );
        });
    });
});

// Register new user
app.post('/user', function(request, response) {
    let {
        login_name,
        password,
        first_name,
        last_name,
        location,
        description,
        occupation
    } = request.body;
    if (!password) {
        console.log('Please enter a password')
        response.status(400).send('Please enter a password');
        return;
    } else {
        User.findOne({login_name}, function(_, user) {
            if (user) {
                console.log('Entered username is taken.')
                response.status(400).send('Entered username is taken.')
                return;
            }
            var passwordEntry = cs142password.makePasswordEntry(password);
            User.create(
                {
                    login_name: login_name,
                    password_digest: passwordEntry.hash,
                    first_name: first_name,
                    last_name: last_name,
                    location: location,
                    description: description,
                    occupation: occupation,
                    salt: passwordEntry.salt
                },
                function(_, newUser) {
                    request.session.login_name = login_name;
                    request.session.user_id = newUser._id;
                    request.session.cookie.user_id = newUser._id;
                    let curr_user = {_id: newUser._id, first_name, last_name, login_name};
                    response.status(200).send(curr_user);
                }
            )
        })
    }
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
