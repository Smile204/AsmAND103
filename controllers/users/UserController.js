const UserModel = require("./UserModel");
const bcrypt = require("bcrypt");
const { sendMail } = require("../../util/mailer")


//Đăng ký
const signup = async (name, email, phone, password) => {
    try {
        /*Check email exists in db - select * from users where email = email => tra ve mot mang
        //find: tra ve mot arr
        //findOne: ket qua tra ve mot object */
        let user = await UserModel.findOne({ email: email });
        if (user) {
            throw new Error("Email này đã được sử dụng. Vui lòng dùng mail khác!");
        }

        //Ma hoa mat khau truoc khi tao tai khoan
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const pass = bcrypt.hashSync(password, salt);
        console.log(pass);

        //Create new user
        user = new UserModel({
            email: email,
            password: pass,
            userName: name,
            phoneNumber: phone
        });
        //Gửi email thông báo thành công
        //App Pass tren gg : zjvl rhcl wkzz hqhy
        setTimeout(async () => {
            const emailData = {
                email: email,
                subject: "Welcome to...",
                content: ""
            }
            await sendMail(emailData);
        }, 0);


        //Save user in DB
        const result = await user.save();
        return result;
    } catch (error) {
        console.log("Sign up error: " + error);
        throw new Error(error.message);
    }
}


//Đăng nhập
const login = async (EmailorPhone, password) => {
    try {
        if (EmailorPhone && EmailorPhone.length === 0 || password && password.length === 0) {
            throw new Error("Không được để trống trường này");
        }
        var user, phone, currEmail;
        //Kiem tra nguoi dung nhap vao la sdt hay mail
        if (!isNaN(EmailorPhone)) {
            //Lay user trong db theo sdt
            user = await UserModel.findOne({ phoneNumber: EmailorPhone });
            phone = EmailorPhone;
        } else {
            //Lay user trong db theo email
            user = await UserModel.findOne({ email: EmailorPhone });
            currEmail = EmailorPhone;
        }

        //Check su ton tai cua user trong db
        if (!user) {
            throw new Error("Tài khoản không tồn tại. Vui lòng sang trang đăng ký!");
        } else {
            //Check password
            // const check = user.password.toString() === password.toString();
            const check = bcrypt.compareSync(password, user.password);
            if (!check) {
                throw new Error("Sai mật khẩu. Vui lòng thử lại!");
            } else {
                const userInfor = {
                    _id: user._id,
                    email: currEmail ? currEmail : user.email,
                    userName: user.userName,
                    role: user.role,
                    carts: user.carts,
                    phoneNumber: phone ? phone : user.phoneNumber,
                    avatar: user.avatar,
                    address: user.address,
                    active: user.active,
                    verify: user.verify,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
                return userInfor;
            }
        }
        // return null;
    } catch (error) {
        console.log("Login error: " + error.message);
        throw new Error("Login is failed!!!");
    }
}


//Cập nhật thông tin
const updateInformation = async (idUser, email, name, address, avatar, phone) => {
    try {
        if (!idUser) {
            throw new Error("Không tìm thấy tài khoản để cập nhật!");
        }

        let userId = await UserModel.findById(idUser); //Trả về một document chứa tất cả thông tin người dùng
        if (!userId) {
            throw new Error("Tài khoản không tồn tại!");
        }

        userId.email = email ? email : userId.email;
        userId.userName = name ? name : userId.userName;
        userId.address = address ? address : userId.address;
        userId.avatar = avatar ? avatar : userId.avatar;
        userId.phoneNumber = phone ? phone : userId.phoneNumber;
        userId.updatedAt = Date.now();

        await userId.save(); //Lưu thông tin mới vào DB

        const newInforUser = {
            email: email,
            userName: name,
            address: address,
            avatar: avatar,
            phoneNumber: phone,
            updatedAt: Date.now()
        }

        return newInforUser;

        // const newInformation = {
        //     email: email,
        //     name: name,
        //     address: address,
        //     avatar: avatar,
        //     phoneNumber: phone
        // }
        // // findByIdAndUpdate là một phương thức trong Mongoose được sử dụng để tìm kiếm và cập nhật một tài liệu dựa trên giá trị _id
        // //option { new: true } để đảm bảo rằng phương thức trả về tài liệu đã được cập nhật thay vì tài liệu ban đầu.
        // const user = UserModel.findByIdAndUpdate(id, newInformation, { new: true });

        // if (!user) {
        //     throw new Error("Không tìm thấy người dùng để cập nhật!");
        // }
        // return newInformation;

    } catch (error) {
        console.log("Update error: " + error);
        throw new Error("Hệ thống xảy ra lỗi không thể cập nhật!");
    }
}


//Xóa một user
const deleteOneUser = async (idUser) => {
    try {
        if (!idUser) {
            throw new Error("Tài khoản không tồn tại");
        }

        const result = await UserModel.deleteOne({ _id: idUser });
        if (!result) {
            throw new Error("Internet error");
        }
        return result;

    } catch (error) {
        console.log(error);
        throw new Error("Lỗi internet. Vui lòng thử lại sau!")
    }
}


const getDetail = async (id) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error("User khong ton tai");
        }
        return user;
    } catch (error) {

    }
}

module.exports = { getDetail, signup, login, updateInformation, deleteOneUser }
