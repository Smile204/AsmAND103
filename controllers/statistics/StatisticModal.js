const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']; //Mảng các ngày trong tuần

const StatisticSchema = new Schema({
    name: { type: String, required: true },
    properties: [{
        propertyName: { type: String, required: true },
        propertyValue: { type: Number, required: true }
    }],
    create_At: {
        type: String, default: ((new Date()).getHours()) + ":" + ((new Date()).getMinutes()) + ":"
            + ((new Date()).getSeconds()) + " - " + daysOfWeek[(new Date()).getDay()] + ", " + (new Date()).getDate()
            + "/" + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear()
    }
})


module.exports = mongoose.models.statistic || mongoose.model('statistic', StatisticSchema)