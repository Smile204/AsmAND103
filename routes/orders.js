var express = require("express");
var router = express.Router();
var controller = require("../controllers/orders/OrderController");
var { validateOrder } = require("../middlewares/Validation");

//URL: http://localhost:8888/orders


// - Xử lý chức năng cho người dùng đặt hàng: POST vao order
/** Method: POST
 * - urrl: http://localhost:8888/orders/payment/:idUser
 * - Đưa dữ liệu vào bảng mới để xử lý
 * - body {idUser, products[], status, total , delivery, payment, create_At} //true la dat hang thanh cong, false : da huy don dat hang
 * - Doi trang thai cua sp trong gio hang thanh false neu da dat hang
 */
router.post("/payment/:idUser", [], async (req, res) => {
    try {
        const { idUser } = req.params;
        const data = req.body;
        const result = await controller.payAndAddOrderHistory(idUser, data.products, data.shippingTitle, data.shipping, data.payment);
        if (!result) {
            throw new Error("Xảy ra lỗi. Vui lòng thử lại sau nè");
        }
        return res.status(200).json({
            status: true,
            data: result
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }
})





// - Xử lý chức năng quản lý đơn hàng mà người dùng đã đặt trước đó: GET
/** Method: GET
 * - Lấy tất cả đơn hàng mà người dùng đã thanh toán du thanh cong hay that bai
 * url: http://localhost:8888/orders/order_history/:idUser
 */
router.get("/order_history/:idUser", async (req, res) => {
    try {
        const { idUser } = req.params;
        const result = await controller.getAllHistory(idUser);
        if (!result) {
            throw new Error("Lỗi gòi. Thử lại sau nheee");
        }
        return res.status(200).json({
            status: true,
            data: result
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }
})


module.exports = router;