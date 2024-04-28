var express = require('express');
var router = express.Router();
var controller = require('../controllers/statistics/StatisticController');

//http://localhost:8888/statistics

/**THỐNG KÊ TOP 10 SỐ LƯỢNG SẢN PHẨM TỒN KHO NHIỀU NHẤT 
 * Method: GET
 * response: trả ra 10 sản phẩm có số lượng tồn kho nhiều nhất
*/
router.get('/inventory_products', async (req, res) => {
    try {
        const result = await controller.spTonKho();
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


/**THỐNG KÊ TOP 10 SẢN PHẨM BÁN CHẠY
 * Method: GET
 * url: http://localhost:8888/statistics/top10_products
 */
router.get('/top10_products', async (req, res) => {
    try {
        const result = await controller.top10BanChay();
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


/**THỐNG KÊ DOANH THU THEO NGÀY*/
router.get('/products_revenue', async (req, res) => {
    try {
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