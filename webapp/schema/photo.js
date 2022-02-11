"use strict";

/*
 * Defined the Mongoose Schema and return a Model for a Photo
 */

/* jshint node: true */

var mongoose = require('mongoose');

/*
 * Photo can have comments and we stored them in the Photo object itself using
 * this Schema:
 */
var commentSchema = new mongoose.Schema({
    comment: String,     // The text of the comment.
    date_time: {type: Date, default: Date.now}, // The date and time when the comment was created.
    user_id: mongoose.Schema.Types.ObjectId,    // 	The ID of the user who created the comment.
});

var tagSchema = new mongoose.Schema({
    x: Number, // Horizontal offset
    y: Number, // Vertical offset
    width: Number, // Width
    height: Number, // Height
    user_id: mongoose.Schema.Types.ObjectId, // User ID of person tagged 
    full_name: String, // Name of person tagged
})

// create a schema for Photo
var photoSchema = new mongoose.Schema({
    file_name: String, // 	Name of a file containing the actual photo (in the directory project6/images).
    date_time: {type: Date, default: Date.now}, // 	The date and time when the photo was added to the database
    user_id: mongoose.Schema.Types.ObjectId, // The ID of the user who created the photo.
    comments: [commentSchema], // Array of comment objects representing the comments made on this photo.
    tags: [tagSchema], // Tags in the photo
    liked_by: [mongoose.Schema.Types.ObjectId], // List of users that liked the photo.
    users_permitted: [mongoose.Schema.Types.ObjectId] // Users permitted to view the photo.
});

// the schema is useless so far
// we need to create a model using it
var Photo = mongoose.model('Photo', photoSchema);

// make this available to our photos in our Node applications
module.exports = Photo;
