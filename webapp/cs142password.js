"use strict";

var crypto = require('crypto');

function makePasswordEntry(clearTextPassword) {
    var salt_val = crypto.randomBytes(8).toString('hex');
    var hasher = crypto.createHash('sha1');
    hasher.update(clearTextPassword + salt_val);
    var hash_val = hasher.digest('hex');
    var passwordEntry = {
        salt: salt_val,
        hash: hash_val
    };
    return passwordEntry;
}

function doesPasswordMatch(hash, salt, clearTextPassword) {
    var hasher = crypto.createHash('sha1');
    hasher.update(clearTextPassword + salt);
    var hash_val = hasher.digest('hex');
    if (hash === hash_val){
        return true;
    }
    else {
        return false;
    }
}

var cs142password =  {
    makePasswordEntry: makePasswordEntry,
    doesPasswordMatch: doesPasswordMatch
 };

module.exports = cs142password;