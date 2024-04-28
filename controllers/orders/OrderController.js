const OrderModal = require("./OrderModal");
const UserModal = require("../users/UserModel");
const CartModal = require("../carts/CartModal");
const ProductModal = require("../products/ProductModal");
const { Error } = require("mongoose");


//Thanh toán rồi thêm đơn hàng đã thanh toán vào lịch sử order
/**
 * Chọn những id sản phẩm cần thanh toán => trả về mảng các id sản phẩm
 * Lấy số lượng x đơn giá => tổng tiền
 * Tính toán số liệu, xóa các sản phẩm đã thanh toán khỏi giỏ hàng, 
 * Lưu sản phẩm đã thanh toán vào bảng order
 */
const payAndAddOrderHistory = async (idUser, products, shippingTitle, shipping, payments) => {
    try {
        const userInDB = await UserModal.findById(idUser);
        if (!userInDB) {
            throw new Error("Không tìm thấy user nè má ơi");
        }

        //Tìm giỏ hàng của người dùng qua idUser
        const userCart = await CartModal.findOne({ userId: idUser });
        // console.log("userCart.products => ", userCart.products)
        if (!userCart) {
            throw new Error("Không tìm thấy giỏ hàng của người dùng");
        }

        //totalprice tính riêng
        const totalprice = products.reduce((acc, curr) => {
            return acc + (curr.productPrice * curr.productQuantity);
        }, 0);

        const newOrder = new OrderModal({
            userId: idUser,
            products: products,
            totalPrice: totalprice + shipping,
            shippingTitle: shippingTitle,
            shipping: shipping,
            payments: payments,
        });

        //Xóa bớt số lượng sản phẩm trong kho khi thanh toán thành công
        for (let i = 0; i < products.length; i++) {
            const productId = products[i].productId;
            const product = await ProductModal.findById(productId); //Trả về một đối tượng obj với tất cả thông tin của sp này
            // console.log('product =>>>>',product);
            if (!product) {
                throw new Error("Không tìm thấy sản phẩm trong kho ")
            }
            //Tìm số lượng của sản phẩm hiện tại trong đơn hàng (bảng order)
            const currPdQtt = products.find((item) => item.productId === productId);
            console.log('=>>>>>>>>>>>', currPdQtt.productQuantity);
            if (!currPdQtt || isNaN(currPdQtt.productQuantity)) {
                throw new Error("Số lượng sản phẩm không hợp lệ");
            }
            product.quantity = product.quantity - currPdQtt.productQuantity;
            const result = await product.save();
            if (!result) {
                throw new Error("Không cập nhật được kho sản phẩm");
            }
        }

        // Lọc ra các sản phẩm cần xóa trong đơn đang thanh toán
        const productsIDInBill = [];
        for (let i = 0; i < products.length; i++) {
            const productId = products[i].productId;
            const productIndex = userCart.productId.findIndex(item => item.idProduct === productId);
            if (productIndex !== -1) {
                productsIDInBill.push(productId);
            }
        }

        // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
        const updatedCart = userCart.productId.filter(item => !productsIDInBill.includes(item.idProduct));
        userCart.productId = updatedCart;
        await userCart.save();


        const savedOrder = await newOrder.save();
        return savedOrder;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Lấy lịch sử order theo idUser
const getAllHistory = async (idUser) => {
    try {
        //check user in DB
        const userInDB = await UserModal.findById(idUser);
        if (!userInDB) {
            throw new Error("Tài khoản không hợp lệ");
        }
        const product = await OrderModal.find({ userId: idUser });
        console.log(product);
        if (!product) {
            throw new Error("Xảy ra lỗi. Vui lòng thử lại sau");
        }

        return product.reverse();
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


module.exports = { payAndAddOrderHistory, getAllHistory };