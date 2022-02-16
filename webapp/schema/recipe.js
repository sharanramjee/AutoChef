"use strict";

/*
 * Defined the Mongoose Schema and return a Model for a Recipe
 */

/* jshint node: true */

var mongoose = require('mongoose');

/*
 * Recipe can have instructions and we stored them in the Recipe object itself using
 * this Schema:
 */
// var commentSchema = new mongoose.Schema({
//     comment: String,     // The text of the comment.
//     date_time: {type: Date, default: Date.now}, // The date and time when the comment was created.
//     user_id: mongoose.Schema.Types.ObjectId,    // 	The ID of the user who created the comment.
// });

// var tagSchema = new mongoose.Schema({
//     x: Number, // Horizontal offset
//     y: Number, // Vertical offset
//     width: Number, // Width
//     height: Number, // Height
//     user_id: mongoose.Schema.Types.ObjectId, // User ID of person tagged 
//     full_name: String, // Name of person tagged
// })

// create a schema for Recipe
var recipeSchema = new mongoose.Schema({
    aggregateLikes: Number,             // Number of likes on Spoonacular
    healthScore: Number,                // Spoonacular health score
    image: String,                      // Link to image of recipe
    missedIngredientCount: Number,      // Number of missing ingredients
    missedIngredient_names: [String],   // List of missing ingredients
    spoonacularScore: Number,           // Spoonacular score
    spoonacularId: Number,              // Spoonacular ID of the recipe
    summary: String,                    // Summary of the recipe
    title: String,                      // Name of the recipe
    usedIngredientCount: Number,        // Number of used ingredients
    usedIngredient_names: [String],     // List of used ingredients
    veryPopular: Boolean,               // Spoonacular populairty
});

// the schema is useless so far
// we need to create a model using it
var Recipe = mongoose.model('Recipe', recipeSchema);

// make this available to our users in our Node applications
module.exports = Recipe;
