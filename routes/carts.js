var express = require('express');
var router = express.Router();
var controller = require("../controllers/carts/CartController")
var { validateCart } = require("../middlewares/Validation")

//KET NOI MONGOOSE
//URL: http://localhost:8888/carts


/** THÊM SẢN PHẨM VÀO GIỎ HÀNG
 * Method: POST
 * url: http://localhost:8888/carts/add_to_cart/:idUser
 * body: productID, productQuantity
 * params: userId
 * response: sản phẩm được thêm vao giỏ hàng
 */
router.post("/add_to_cart/:idUser", [validateCart], async (req, res) => {
    try {
        const { idUser } = req.params;
        const data = req.body;
        const result = await controller.addProductToCart(idUser, data.idProduct, data.quantity);
        if (!result) {
            throw new Error("Xay ra loi. Thu lai sau");
        }
        return res.status(200).json({
            status: true,
            message: "Them thanh cong",
            result: result
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>>>>>Lỗi: " + error.message,
            error
        })
    }
});


/** LẤY THÔNG TIN GIỎ HÀNG
 * Method: GET
 * url: http://localhost:8888/carts/get_cart/:idUser
 * params: idUser
 * response: trả về thông tin giỏ hàng của người dùng
 */
// router.get("/get_cart/:idUser", async (req, res) => {
//     try {
//         const { idUser } = req.params;
//         const result = await controller.getCartProduct(idUser);
//         if (!result) {
//             throw new Error("Xảy ra lỗi. Vui lòng thử lại sau");
//         }
//         return res.status(200).json({
//             status: true,
//             message: "Lấy thông tin giỏ hàng thành công",
//             result: result
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             status: false,
//             message: ">>>>>>>>>>Lỗi: " + error.message,
//             error
//         });
//     }
// });


/** LẤY SẢN PHẨM CỦA GIỎ HÀNG
 * Method: GET
 * url: http://localhost:8888/carts
 * params: iUser
 * response: thông tin tất cả sản phẩm có trong giỏ hàng
 */
router.get("/get_product_of_cart/:idUser", async (req, res) => {
    try {
        const { idUser } = req.params;
        const result = await controller.getProductOfCart(idUser);
        if (!result) {
            throw new Error("Xảy ra lỗi. Vui lòng thử lại sau");
        }
        return res.status(200).json({
            status: true,
            message: "Lấy sản phẩm thành công",
            result: result
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>>>>>Lỗi: " + error.message,
            error
        });
    }
});


/** CẬP NHẬT GIỎ HÀNG
 * Method: PUT
 * url: http://localhost:8888/carts/update_cart/:idUser
 * body: {productId, quantity}
 * params: idUser
 * response: Tăng giảm số lượng sản phẩm
 */
router.put("/update_cart/:idUser", async (req, res) => {
    try {
        const { idUser } = req.params;
        const data = req.body;
        const result = await controller.updateCart(idUser, data.productId, data.quantity);
        if (!result) {
            throw new Error("Xảy ra lỗi. Vui lòng thử lại sau");
        }
        return res.status(200).json({
            status: true,
            message: "Cập nhật giỏ hàng thành công",
            result: result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>>>>>Lỗi: " + error.message,
            error
        });
    }
});



/** XÓA MỘT SẢN PHẨM RA KHỎI GIỎ HÀNG
 * url: http://localhost:8888/carts/delete_one_product_in_cart/:idUser
 * Method: DELETE
 * params: idUser
 * response: Xóa 1 sản phẩm khỏi giỏ hàng
 */
router.delete("/delete_one_product_in_cart/:idUser", async (req, res) => {
    try {
        const { idUser } = req.params;
        const data = req.body;
        const result = await controller.deleteProductInCart(idUser,data.idProduct);
        if (!result) {
            throw new Error("Xảy ra lỗi. Vui lòng thử lại sau");
        }
        return res.status(200).json({
            status: true,
            message: "Xóa sản phẩm thành công",
            result: result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>>>>>Lỗi: " + error.message,
            error
        });
    }
})


/** XÓA TẤT CẢ SẢN PHẨM RA KHỎI GIỎ HÀNG
 * Method: DELETE
 * url: http://localhost:8888/carts/delete_all_product_in_cart/:idUser
 * params: idUser
 * response: Xóa hết sản phẩm khỏi giỏ hàng
 */
router.delete("/delete_all_product_in_cart/:idUser", async (req, res) => {
    try {
        const { idUser } = req.params;
        const result = await controller.deleteAllPdInCart(idUser);
        if (!result) {
            throw new Error("Xảy ra lỗi. Vui lòng thử lại sau");
        }
        return res.status(200).json({
            status: true,
            message: "Xóa sản phẩm thành công",
            result: result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>>>>>Lỗi: " + error.message,
            error
        });
    }
})


module.exports = router;