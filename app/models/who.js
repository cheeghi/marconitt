var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Who', new Schema({
	name: String,
	type: Number
}));