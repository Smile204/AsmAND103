const mongoose = require("mongoose");
const Schema = mongoose.Schema; //Tao mot object model tu schema

const ProductModel = new Schema({
    //Id mongoose tu tao
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    images: { type: Array, required: true, default: [] },
    description: { type: String, default: "Đang cập nhât...." },
    size: { type: String, required: true },
    origin: { type: String, default: "Đang cập nhật..." },
    typeId: { type: String, required: true },
    categoryId: { type: String, required: true },
    hiddenProduct: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() }
});

//Khoi tao model, kiem tra xem model da duoc khoi tao hay chua, neu da duoc khoi tao se khong khoi tao lai nua
module.exports = mongoose.model.product || mongoose.model("product", ProductModel);