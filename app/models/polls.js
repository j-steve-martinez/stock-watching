'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    uid: String,
    name: String,
    isAuthReq: Boolean,
    list: [{key: String, value: Number}],
    voters: []
});

module.exports = mongoose.model('Poll', Poll);
