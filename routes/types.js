var express = require('express');
var router = express.Router();
var controller = require('../controllers/types/TypeController');
var { validateAddType } = require('../middlewares/Validation')

//URL: http://localhost:8888/types

/**LẤY CHI TIẾT TYPE BẰNG NAME
 * Method: POST
 * url: http://localhost:8888/types/get_type_detail_by_name/:idCate
 * body: name
 */
router.post("/get_type_detail_by_name/:idCate", async (req, res) => {
    try {
        const {idCate} = req.params;
        const { name } = req.body;
        const result = await controller.getTypeDetaiByName(idCate,name);
        if (!result) {
            throw new Error("Xảy ra lỗi. Không có sản phẩm nào tồn tại");
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
            error: "=>>>>>" + error
        });
    }
})


//Lay tat ca type
router.get("/getalltype", async (req, res) => {
    try {
        const result = await controller.getAllType();
        if (!result) {
            throw new Error("Loi he thong");
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

//Them mot productType
router.post('/add_new_pdtype', [validateAddType], async (req, res) => {
    try {
        const data = req.body;
        const result = await controller.addNewType(data.name, data.description);
        if (!result) {
            throw new Error("Add new type failed");
        }
        return res.status(200).json({ status: true, data: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }
});


//Get product of type
router.get('/getpd_for_type/:idType', async (req, res) => {
    try {
        const { idType } = req.params;
        const result = await controller.getPdOfType(idType);
        if (!result) {
            throw new Error("Get products failed");
        }
        return res.status(200).json({ status: true, message: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }
});



//Cap nhat thong tin products type
router.put("/update_type/:idType", [validateAddType], async (req, res) => {
    try {
        const { idType } = req.params;
        const data = req.body;
        const result = await controller.updatePdType(idType, data.name, data.description);
        if (!result) {
            throw new Error("Update products type failed");
        }
        return res.status(200).json({ status: true, message: result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: error.message,
            error
        });
    }
});


//Xoa products type
router.delete('/delete_pd_type/:idType', async (req, res) => {
    try {
        const { idType } = req.params;
        const result = await controller.deleteOneType(idType);
        if (!result) {
            throw new Error("Delete products type failed");
        }
        return res.status(200).json({ status: true, message: result });
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