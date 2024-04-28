var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CateSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: "Đang cập nhật..." },
});


module.exports = mongoose.models.category || mongoose.model("category", CateSchema);