var express = require('express');
var router = express.Router();
var controller = require('../controllers/products/ProductController');
var { validateProduct } = require('../middlewares/Validation');

//URL: http://localhost:8888/products


/**Lấy thông tin chi tiết sản phẩm theo id
 * Method: GET
 * url: http://localhost:8888/products/get_product_detailt/:idProduct
 * params: idProduct
 * response: Hiện thông tin chi tiết của sản phẩm
 */
router.get("/get_product_detailt/:idProduct", async (req, res) => {
    try {
        const { idProduct } = req.params;
        const result = await controller.getProductDetail(idProduct);
        if (!result) {
            throw new Error("Lỗi hệ thống. Lấy thông tin thất bại");
        }
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>>>Error: " + error.message,
            error: error
        });
    }
})


/*Thêm một sản phẩm
* method: POST
* url: http://localhost:8888/products/add_new_product
* body: {data.name,data.price,data.quantity,data.images,data.description,data.size,data.origin,data.typeId,data.categoryId}
* response: san pham moi
*/
router.post('/add_new_product', [validateProduct], async (req, res) => {
    try {
        const data = req.body;
        const result = await controller.addNewProduct(data.name, data.price, data.quantity, data.images, data.description, data.size, data.origin, data.typeId, data.categoryId, data.hiddenProduct);
        if (!result) {
            throw new Error("Loi he thong. Them that bai");
        }
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>>>Error: " + error.message,
            error: error
        });
    }
});


/** CẬP NHẬT THÔNG TIN SẢN PHẨM
 * Method: PUT
 * Url: http://localhost:8888/products/update_product_information/:idProduct
 * body: { newName, newPrice, newQuantity, NewImages, newDescription, newSize, newOrigin, newTypeId, newCategoryId}
 * pamrams : idProduct
 * response: Thông tin sản phẩm mới
 */
router.put("/update_product_information/:idProduct", [validateProduct], async (req, res) => {
    try {
        const { idProduct } = req.params;
        const data = req.body;
        const result = await controller.updateProduct(idProduct, data.name, data.price, data.quantity, data.images, data.description, data.size, data.origin, data.typeId, data.categoryId, data.hiddenProduct);
        if (!result) {
            throw new Error("Loi he thong. Cap nhat that bai");
        }
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>Error: " + error.message,
            error
        });
    }
});


/** XÓA PRODUCT
 * Method: PUT
 * url: http://localhost:8888/products/delete_product/:idProduct
 * params: idProduct
 * respone: sản phẩm thay đổi trạng thái, không hoàn toàn biến mất khỏi database
 */
router.put("/delete_product/:idProduct", async (req, res) => {
    try {
        const { idProduct } = req.params;
        const result = await controller.deleteProduct(idProduct);
        if (!result) {
            throw new Error("Lỗi hệ thống. Vui lòng thử lại sau!");
        }
        return res.status(200).json({ status: true, message: "Xoa thanh cong", data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>Error: " + error.message,
            error
        });
    }
})


/**Lay tat ca san pham tren database */
router.get("/getall", async (req, res) => {
    try {
        const result = await controller.getAllProduct();
        if (!result) {
            throw new Error("Loi Internet");
        }
        return res.status(200).json({ status: true, data: result, message: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>Error: " + error.message,
            error
        });
    }
})


/**Tìm kiếm theo tên sản phẩm
 * Method: Post
 * params: name
 * url: http://localhost:8888/products/find_product/:name
 * controller: getProductDetailByName
 */
router.post("/find_product/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const result = await controller.getProductDetailByName(name);
        if (!result) {
            throw new Error("Lỗi rồi nè");
        }
        return res.status(200).json({ status: true, data: result, message: 'Lay san pham thanh cong' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>Error: " + error.message,
            error
        });
    }
})


/**XÓA MỘT SẢN PHẨM KHỎI DATABASE
 * - controller: deleteOneProduct
 * - url: http://localhost:8888/products/detele_oneitem_inpd/:idProduct
 */
router.post('/detele_oneitem_inpd/:idProduct', async (req, res) => {
    try {
        const { idProduct } = req.params;
        const result = await controller.deleteOneProduct(idProduct);
        if (!result) {
            throw new Error("Xảy ra lỗi gòi nè. Thử lại sau nheee");
        }
        return res.status(200).json({
            status: true,
            data: result
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: ">>>>>>Error: " + error.message,
            error
        });
    }
})


module.exports = router;