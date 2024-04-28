const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: "Updating..." }
});


module.exports = mongoose.models.type || mongoose.model('type', TypeSchema);