var express = require('express');
var router = express.Router();
const userController = require('../controllers/users/UserController');
const { validateRegister, validateUpdateUser } = require("../middlewares/Validation");

//URL: http://localhost:8888/users

/** Đăng ký
 * - DK: POST
 * - req.body: {fullName,email,phoneNumber,password, repass}
*/
router.post('/register', (req, res, next) => {
    try {
        const data = req.body;
        if (data.fullName.trim() == "" || data.fullName.length === 0) {
            throw new Error("Không được để trống mail");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email) || data.email.trim() == "") {
            throw new Error("Vui lòng nhập mail đúng định dạng và không được để trống mail!");
        }

        const checkEmail = users.find((item) => item.email.toString() === data.email.toString());
        if (checkEmail) {
            throw new Error("Email đã được sử dụng. Vui lòng dùng mail khác!");
        }

        const phoneNumberRegex = /^(?:0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\d{7}$/; // Theo từng vùng miền ở Việt Nam
        const phoneNumberRegex10 = /^\d{10}$/; // 10 số
        if (!phoneNumberRegex.test(data.phoneNumber) || data.phoneNumber.trim() == "" || isNaN(data.phoneNumber)) {
            throw new Error("Vui lòng nhập số và không để trống ")
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=])[a-zA-Z\d!@#$%^&*()-_+=]{8,}$/;
        if (!passwordRegex.test(data.password) || data.password.length < 6 || data.password.trim() == "") {
            throw new Error("Vui lòng không để trống trường này!");
        }

        if (data.password !== data.rePassword) {
            throw new Error("Password phai trung nhau");
        }

        const newUser = {
            id: users.length + 1,
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: "",
            avatar: "",
            password: data.password
        }
        users.push(newUser);
        return res.status(200).json({ message: 'success', newUser: newUser })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});
/** Dung mongooseDB 
 * - Method: POST
 * - URL: http://localhost:8888/users/signup
 * - body: {email: "abc@gmail.com", password: "1234", name: "Nguyen Van A", phoneNumber: '032768453}
 * - response: tra ve message thong bao neu dang ky that bai
*/
router.post('/signup', [validateRegister], async (req, res, next) => {
    try {
        const data = req.body;
        var result = await userController.signup(data.name, data.email, data.phoneNumber, data.password);
        if (!result) {
            throw new Error("Đăng ký thất bại. Vui lòng thử lại sau!");
        }
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log("Sign up error: " + error);
        return res.status(500).json({ message: error.message });
    }
});



/** Đăng nhập tài khoản người dùng
 * - Method: POST
 * - red.body {email(phone),password}
 */
router.post('/login', (req, res, next) => {
    try {
        const data = req.body;
        let user; //gia lap nguoi dung
        if (isNaN(data.email)) {
            //Đăng nhập với email
            user = users.find((element) => element.email.toString() === data.email.toString());
            if (!user) {
                throw new Error("Email không tồn tại. Vui lòng đăng ký một tài khoản!");
            }
        } else {
            //Đăng nhập với phoneNumber
            user = users.find((item) => item.phoneNumber.toString() === data.email.toString());
            if (!user) {
                throw new Error("Số điện thoại chưa dược đăng ký! Vui lòng đăng ký một tài khoản")
            }
        }

        //Kiểm tra mật khẩu
        if (user.password.toString() !== data.password.toString()) {
            throw new Error("Password sai vui lòng thử lại!")
        }

        return res.status(200).json({ message: 'Thành công', userInfo: user })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Login failed" });
    }
});
/** Dang nhap dung mongooseDB
 * - Method: POST
 * - body {email: 'abc@gmail', phone: '0326574869', password: "1w24"}
 */
router.post('/signin', async (req, res, next) => {
    try {
        const data = req.body;
        let result = await userController.login(data.email, data.password);
        return res.status(200).json({ status: true, message: "Login success", data: result })
    } catch (error) {
        console.log("Error login: " + error.message);
        return res.status(500).json({ message: error.message });
    }
})



/**Thay đổi thông tin người dùng
 * - Method: PUT
 * - red.body = {fullName,email,phoneNumber,address,avatar,password}
 */
router.put('/update/:id', (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ đường dẫn URL
        //const {id} = req.query ; //id sau ?
        const data = req.body;

        const index = users.findIndex((item) => item.id.toString() === id.toString());
        if (index === -1) {
            throw new Error("Lỗi hệ thống");
        }

        if (data.fullName.trim() == "" || data.fullName.length === 0) {
            throw new Error("Không được để trống mail");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email) || data.email.trim() == "") {
            throw new Error("Vui lòng nhập mail đúng định dạng và không được để trống mail!");
        }

        const phoneNumberRegex = /^(?:0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\d{7}$/; // Theo từng vùng miền ở Việt Nam
        if (!phoneNumberRegex.test(data.phoneNumber) || isNaN(data.phoneNumber)) {
            throw new Error("Vui lòng nhập số ")
        }

        const newInfor = {
            fullName: data.fullName,
            email: data.email,
            address: data.address,
            phoneNumber: data.phoneNumber,
            avatar: data.avatar
        }
        users[index].slice(index, 1, newInfor);

        return res.status(200).json({ message: "Cập nhật thành công!", UserInfo: users[index] })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hệ thống xảy ra lỗi. Vui lòng thử lại sau!" });
    }
});
/** Update dung mongoose
 * - Method: PUT
 * - body {email, name, address, avatar,phone}
 */
router.post('/updateinformation/:id', [validateUpdateUser], async (req, res, next) => {
    try {
        //Lay id tu parameters
        const { id } = req.params;
        const data = req.body;

        const result = await userController.updateInformation(id, data.email, data.name, data.address, data.avatar, data.phoneNumber);
        if (!result) {
            throw new Error("Xảy ra lỗi trong quá trình cập nhật. Vui lòng thử lại sau!");
        }
        return res.status(200).json({ status: true, result: result });
    } catch (error) {
        console.log("Update error: " + error);
        return res.status(500).json({ status: false, message: error.message });
    }
});


/**XÓA 1 USER khỏi database trên mongoose
 * - Method: Delete
 * - body : idUser
 */
router.delete("/delete/:idUser", async (req, res) => {
    try {
        const { idUser } = req.params;
        const result = await userController.deleteOneUser(idUser);
        if (!result) {
            throw new Error("Lỗi Hệ thống. Thử lại sau!");
        }
        return res.status(200).json({ status: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
});


router.post('/user-detailt/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userController.getDetail(id);
        if (!result) {
            throw new Error("Loi roi");
        }
        return res.status(200).json({ status: 200, data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
})


module.exports = router;

const users = [
    {
        "id": 1,
        "fullName": 'Nguyen Van A',
        "email": 'nguyenvana@gmail.com',
        "phoneNumber": '01234568576',
        "address": 'VN',
        "avatar": "https://i.pinimg.com/564x/f4/b5/af/f4b5af3da6f9e4b90bb11d0afcf0470d.jpg",
        "password": "1234",
        "carts": []
    },
    {
        "id": 2,
        "fullName": 'Bui Van Dinh',
        "email": 'dinhbv@gmail.com',
        "phoneNumber": '01234568576',
        "address": 'HCM',
        "avatar": "https://i.pinimg.com/564x/f4/b5/af/f4b5af3da6f9e4b90bb11d0afcf0470d.jpg",
        "password": "14532",
        "carts": []
    }
]
