var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']; //Mảng các ngày trong 

const OrderSchema = new Schema({
    userId: { type: String, required: true },
    products: [{
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        productPrice: { type: Number, required: true }, //Giá
        productQuantity: { type: Number, default: 0 }, //Số lượng
        productType: { type: String, required: true }, //Type
        productImage: { type: String, required: true }
    }],
    totalPrice: { type: Number, default: 0 },
    shipping: { type: Number, required: true },
    payments: { type: String, required: true },
    status: { type: Boolean, default: true },
    create_At: {
        type: String, default: ((new Date()).getHours()) + ":" + ((new Date()).getMinutes()) + ":"
            + ((new Date()).getSeconds()) + " - " + daysOfWeek[(new Date()).getDay()] + ", " + (new Date()).getDate()
            + "/" + ((new Date()).getMonth() + 1) + '/' + (new Date()).getFullYear()
    }
});


module.exports = mongoose.models.order || mongoose.model("order", OrderSchema);