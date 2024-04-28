//Khai báo 1 sce=hema cho users
// Các trường cần thêm (_id, email, pasword, name, role, carts,createAt, updateAt, available, avatar, address, phoneNumber)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Khai bao model
const UserSchema = new Schema({
    //Id trong mongoose tu dong co
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    role: { type: Number, default: 1 },
    // carts: { type: Array, default: [] },
    phoneNumber: { type: String, required: true },
    avatar: { type: String, default: "" },
    address: { type: String, default: "" },
    active: { type: Boolean, default: true }, //false tk khong doat dong
    verify: { type: Boolean, default: false }, //Xac minh tai khoan
    //Ngay gio tao tai khoan
    createdAt: { type: Date, default: Date.now },
    //Ngay gio cap nhat
    updatedAt: { type: Date, default: Date.now }
});

//user viet tieng anh so it khong dau khong cach khong ki tu dac biet, database tieng amh so nhieu
module.exports = mongoose.models.user || mongoose.model("user",UserSchema);