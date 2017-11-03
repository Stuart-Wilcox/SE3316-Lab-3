// model/entry.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = Schema({
    text: String,
    code: String,
    date: Date
});

module.exports = mongoose.model('Entry', EntrySchema);