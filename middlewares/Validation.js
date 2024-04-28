//VALIDATE USER
const validateRegister = async (req, res, next) => {
    try {
        const data = req.body;
        if (data.name.trim() == "" || data.name.length === 0) {
            throw new Error("Không được để trống mail");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email) || data.email.trim() == "") {
            throw new Error("Vui lòng nhập mail đúng định dạng và không được để trống mail!");
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=])[a-zA-Z\d!@#$%^&*()-_+=]{8,}$/;
        if (!passwordRegex.test(data.password) && data.password.length < 6 || data.password.trim() == "") {
            throw new Error("Vui lòng không để trống trường này!");
        }

        const phoneNumberRegex = /^(?:0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\d{7}$/; // Theo từng vùng miền ở Việt Nam
        if (!phoneNumberRegex.test(data.phoneNumber) || data.phoneNumber.trim() == "" || isNaN(data.phoneNumber)) {
            throw new Error("Vui lòng nhập số điện thoại và không để trống ")
        }

        //Dữ liệu ok cho next() sang lệnh tiếp theo để xử lý
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error: error
        });
    }
}

const validateUpdateUser = async (req, res, next) => {
    try {
        const data = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email) || data.email.trim() == "") {
            throw new Error("Vui lòng nhập mail đúng định dạng và không được để trống mail!");
        }

        const phoneNumberRegex = /^(?:0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])\d{7}$/; // Theo từng vùng miền ở Việt Nam
        if (!phoneNumberRegex.test(data.phoneNumber) || data.phoneNumber.trim() == "" || isNaN(data.phoneNumber)) {
            throw new Error("Vui lòng nhập số điện thoại và không để trống ")
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error: error
        });
    }
}


//VALIDATE TYPE PRODUCTS
const validateAddType = async (req, res, next) => {
    try {
        const data = req.body;
        if (data.name && (data.name.length === 0 || !isNaN(data.name))) {
            throw new Error("Please input type name by text");
        }

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }
}


//VALIDATE CATEGORY
const validateCategory = async (req, res, next) => {
    try {
        const data = req.body;
        if (data.name && data.name.trim() === "") {
            throw new Error("Name cannot be blank")
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }
}


//VALIDATE PRODUCTS
const validateProduct = async (req, res, next) => {
    try {
        const data = req.body;

        if (!data.name || typeof data.name !== 'string') {
            throw new Error("Tên sản phẩm không hợp lệ");
        }

        if (!data.price || isNaN(data.price) || data.price < 0) {
            throw new Error("Giá sản phẩm không hợp lệ");
        }

        if (!data.quantity || isNaN(data.quantity) || data.quantity <= 0) {
            throw new Error("Số lượng sản phẩm không hợp lệ");
        }

        if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
            throw new Error("Hình ảnh sản phẩm không hợp lệ");
        }

        if (typeof data.description !== 'string') {
            throw new Error("Mô tả sản phẩm không hợp lệ");
        }

        if (data.size && typeof data.size !== 'string') {
            throw new Error("Kích thước sản phẩm không hợp lệ");
        }

        if (data.origin && typeof data.origin !== 'string') {
            throw new Error("Xuất xứ sản phẩm không hợp lệ");
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }
}


//VALIDATE CARTS
const validateCart = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data.quantity || isNaN(data.quantity) || data.quantity < 0) {
            throw new Error("Không để trống sô lượng. Số lượng phải là một số lớn hơn 0");
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }

}


//VALIDATE ORDER
const validateOrder = async (req, res, next) => {
    try {
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }
}


module.exports = {
    validateRegister, validateUpdateUser, validateAddType,
    validateCategory, validateProduct, validateCart, validateOrder
}