var express = require('express');
var router = express.Router();
var controller = require('../controllers/categories/CateController');
var { validateCategory } = require('../middlewares/Validation')

//URL: http://localhost:8888/categories
//Lay danh muc
router.get('/getallcate', async (req, res) => {
    try {
        const result = await controller.getAll();
        if (!result) {
            throw new Error("He thong xay ra loi");
        }
        return res.status(200).json({
            status: true,
            data: result,
            message: "Lay danh muc thanh cong"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
})


//Lay tat ca danh muc voi sp
router.get("/get_all_cate", async (req, res) => {
    try {
        const result = await controller.getAllCate();
        if (!result) {
            throw new Error("He thong xay ra loi");
        }
        return res.status(200).json({
            status: true,
            data: result,
            message: "Lay danh muc thanh cong"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
})

//Thêm một danh mục
router.post("/add_new_category", [validateCategory], async (req, res) => {
    try {
        const data = req.body;
        const result = await controller.addNewCategory(data.name, data.description);
        if (!result) {
            throw new Error("An error occurred. Please try again later");
        }
        return res.status(200).json({ status: true, Result: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
});


//Lấy danh sách sản phẩm của từng danh mục
router.get("/get_product_of_cate/:idCate", async (req, res) => {
    try {
        const { idCate } = req.params;
        const result = await controller.getProductOfCate(idCate);
        if (!result) {
            throw new Error("An error occurred. Please try again later");
        }
        return res.status(200).json({ status: true, Result: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
});


//Cập nhật thông tin từng danh mục
router.put("/update_cate/:idCate", [validateCategory], async (req, res) => {
    try {
        const { idCate } = req.params;
        const data = req.body;
        const result = await controller.updateCate(idCate, data.name, data.description);
        if (!result) {
            throw new Error("An error occurred. Please try again later");
        }
        return res.status(200).json({ status: true, Result: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
});


/** XÓA MỘT DANH MỤC 
 * - Kiểm tra ràng buộc với các sản phẩm đang tôn tại trong danh mục, danh mục không còn sản phẩm nào mới được xóa
 */
router.delete('/delete_cate/:idCate', async (req, res) => {
    try {
        const { idCate } = req.params;
        const result = await controller.deleteOneCate(idCate);
        if (!result) {
            throw new Error("An error occurred. Please try again later");
        }
        return res.status(200).json({ status: true, Result: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: error.message });
    }
})



module.exports = router;