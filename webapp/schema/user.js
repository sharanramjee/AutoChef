"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

// var favoriteSchema = new mongoose.Schema({
//     id: Number,     // Spoonacular ID of the recipe
//     name: String,   // Name of the recipe

//     // Add more properties here later
// });

// create a schema
var userSchema = new mongoose.Schema({
    first_name: String,    // First name of the user.
    last_name: String,     // Last name of the user.
    location: String,      // Location  of the user.
    description: String,   // A brief user description.
    occupation: String,    // Occupation of the user.
    login_name: String,    // Login name.
    password_digest: String,    // Password digest.
    salt: String,               // Password salt.
    mentioned: [mongoose.Schema.Types.ObjectId],    // List of photos that mention user.
    favorites: [String],    // List of recipe IDs favorited by user.
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
