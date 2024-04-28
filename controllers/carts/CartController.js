const CartModal = require("./CartModal");
const ProductModal = require("../products/ProductModal");
const UserModal = require("../users/UserModel");
const TypeModal = require("../types/TypeModal");

//Thêm sản phẩm vào giỏ hàng
const addProductToCart = async (idUser, idProduct, quantity) => {
    try {
        if (!idUser || !idProduct) {
            throw new Error("Invalid id");
        }

        const productInDB = await ProductModal.findById(idProduct);
        if (!productInDB) {
            throw new Error("San pham khong ton tai");
        }

        const userInDB = await UserModal.findById(idUser);
        if (!userInDB) {
            throw new Error("Tai khoan khong ton tai");
        }

        let userInCart = await CartModal.findOne({ userId: idUser });
        if (!userInCart) {
            const newCart = new CartModal({
                userId: idUser,
                productId: [{ idProduct, quantity }],
                totalPrice: 0,
                quantity: 0,
                status: false
            });
            userInCart = await newCart.save();
        } else {
            const productIndex = userInCart.productId.findIndex(item => item.idProduct === idProduct);
            if (productIndex !== -1) {
                // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
                userInCart.productId[productIndex].quantity += quantity;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
                userInCart.productId.push({ idProduct, quantity });
            }
            userInCart = await userInCart.save();
        }

        return userInCart;

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Lấy thông tin giỏ hàng
const getCartProduct = async (idUser) => {
    try {
        if (!idUser) {
            throw new Error("Id khong hop le");
        }

        const userInCart = await CartModal.findOne({ userId: idUser });
        if (!userInCart) {
            throw new Error('Nguoi dung chua co gio hang');
        }
        return userInCart;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Lấy thông tin sản phẩm trong giỏ hàng
const getProductOfCart = async (idUser) => {
    try {
        if (!idUser) {
            throw new Error("Tài khoản không hợp lệ");
        }

        var cart = await CartModal.findOne({ userId: idUser });
        if (!cart) {
            cart = new CartModal({
                userId: idUser,
                productId: []
            })
            // throw new Error('Người dùng đang có giỏ hàng trống');
        }

        //Lay tat ca san pham dang co trong gio hang
        var productInCart = await cart.productId.map(item => {
            return {
                idProduct: item.idProduct,
                quantity: item.quantity
            }
        }); // => tra ve tat ca sp dang co trong gio hang gom id va so luong
        // console.log(productInCart);
        if (!productInCart || productInCart.length === 0) {
            productInCart = [];
            // throw new Error("Khong tim thay san pham");
        }

        //Lấy sản phẩm trong giỏ hàng => Tra ve cac id cua cac san pham trong gio hang
        const product = await productInCart.map(product => product.idProduct);
        if (!product) {
            throw new Error("Không có sản phẩm trong giỏ hàng");
        }

        //Tim thong tin san pham cua gio hang tu kho san pham => tra ve thong tin chi tiet cua tung sp
        const result = await ProductModal.find({ _id: { $in: product } });

        if (!result) {
            throw new Error("Xảy ra lỗi khi lấy sản phẩm");
        }

        const userOfCart = {
            userId: idUser,
            productId: await Promise.all(result.map(async (product) => {
                //Lay so luong san pham tu cart theo id sp
                const cartItem = productInCart.find((item) => item.idProduct.toString() === product._id.toString());
                let typeName = '';
                const type = await TypeModal.findById(product.typeId);
                if (type) {
                    typeName = type.name;
                }
                return {
                    idProduct: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: cartItem.quantity,
                    images: product.images[0],
                    type: typeName
                }
            }))
        }
        // console.log("userOfCart>>>>>>>>>", userOfCart);
        return userOfCart;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Cập nhật giỏ hàng
const updateCart = async (userId, productId, quantity) => {
    try {
        if (!userId || !productId) {
            throw new Error("Id không hợp lệ");
        }
        const cart = await CartModal.findOne({ userId: userId });
        if (!cart) {
            throw new Error("Giỏ hàng không tồn tại");
        }

        // Cập nhật thông tin sản phẩm trong giỏ hàng
        const productIndex = cart.productId.findIndex(item => item.idProduct === productId);
        if (productIndex !== -1) {
            // cart.productId[productIndex].quantity = quantity;
            // const result = await cart.save();
            if (quantity === 0) {
                // Xóa sản phẩm khỏi mảng nếu số lượng là 0
                cart.productId.splice(productIndex, 1);
            } else {
                cart.productId[productIndex].quantity = quantity;
            }
            const result = await cart.save();
            if (!result) {
                throw new Error("Xảy ra lỗi. Vui lòng thử lại sau");
            }
            return result;
        } else {
            throw new Error("Sản phẩm không tồn tại trong giỏ hàng của người dùng này");
        }
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Xóa 1 sản phẩm khỏi giỏ hàng
const deleteProductInCart = async (idUser, productId) => {
    try {
        if (!idUser) {
            throw new Error("Id không hợp lệ");
        }
        const cart = await CartModal.findOne({ userId: idUser });

        // Xóa sản phẩm khỏi giỏ hàng
        cart.productId = cart.productId.filter(item => item.idProduct !== productId);
        const result = await cart.save();

        if (!result) {
            throw new Error("Xảy ra lỗi khi xóa sản phẩm");
        }
        return cart;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Delete tất cả sản phẩm trong giỏ hàng
const deleteAllPdInCart = async (idUser) => {
    try {
        if (!idUser) {
            throw new Error("Id không hợp lệ");
        }

        const cart = await CartModal.findOne({ userId: idUser });
        if (!cart) {
            throw new Error("Giỏ hàng không tồn tại");
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.productId = [];
        const result = await cart.save();
        if (!result) {
            throw new Error("Xảy ra lỗi. Vui lòng thử lại sau")
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


module.exports = {
    addProductToCart, getCartProduct, updateCart,
    deleteProductInCart, getProductOfCart, deleteAllPdInCart
};