'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
    uid: String,
    name: String,
    symbol: String
});

module.exports = mongoose.model('Stock', Stock);