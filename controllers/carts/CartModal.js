var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {type: String, required: true},
    productId: [{
        idProduct: { type: String, required: true },
        quantity: { type: Number, default: 0 } // Thêm trường số lượng sản phẩm
    }],
    totalPrice: {type: Number, default: 0},
    totalQuantity: {type: Number, default: 0},
    status: {type: Boolean, default: false},
    create_At: {type: Date, default: Date.now()},
    update_At: {type: Date, default: Date.now()}
});

module.exports = mongoose.models.cart || mongoose.model("cart", CartSchema);