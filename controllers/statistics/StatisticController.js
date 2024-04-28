const StatisticModal = require('./StatisticModal');
const ProductModal = require('../products/ProductModal');
const OrderModal = require('../orders/OrderModal');

const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']; //Mảng các ngày trong tuần
var date = new Date();

/**THỐNG KÊ TOP 10 SỐ LƯỢNG SẢN PHẨM TỒN KHO NHIỀU NHẤT 
 * Method: GET
 * response: trả ra 10 sản phẩm có số lượng tồn kho nhiều nhất
*/
const spTonKho = async () => {
    try {
        let query = {};
        const product = await ProductModal
            .find(query, 'name quantity')
            .sort({ quantity: -1 })
            .limit(10)

        // console.log('Sản phẩm tồn kho =>>>', product);
        if (!product) {
            throw new Error("Lỗi hệ thống gòi =)))");
        }

        let property = [];
        for (let i = 0; i < product.length; i++) {
            const pd = {
                propertyName: product[i].name,
                propertyValue: product[i].quantity
            }
            property.push(pd);
        }
        // console.log("property=>>>>>", property);
        const statistic = new StatisticModal({
            name: "Top 10 sản phẩm tồn kho",
            properties: property,
            create_At: (date.getHours()) + ":" + (date.getMinutes()) + ":"
                + (date.getSeconds()) + " - " + daysOfWeek[date.getDay()] + ", " + date.getDate()
                + "/" + (date.getMonth() + 1) + '/' + date.getFullYear()

        });

        const result = await statistic.save()
        if (!result) {
            throw new Error("Không lưu được bảng thống kê");
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}



/**THỐNG KÊ SẢN PHẨM BÁN CHẠY
 * Method; GET
 * - Gợi ý: lấy từ lịch sử mua hàng
 * + cộng tất cả số lượng của một sản phẩm trong các đơn hàng
 * + Trả về tổng số lượng của từng sản phẩm, gồm các obj chưa id, name, quantity
 */
const top10BanChay = async () => {
    try {
        const productHistory = await OrderModal.find();
        //Sản phẩm trong lịch sử mua hàng của tất cả user
        const products = productHistory.map((item) => {
            return item.products;
        })
        //console.log("products=>>", products); //=> Mảng lồng vào bên trong mảng, mảng con chứa các object thông tin sản phẩm đã được user mua

        /** Giá trị trả về của lịch sử các đơn hàng
         * [
            [{
            productId: '66003d1f31f08d88995f8ab3',
            productName: 'Hoa mai',
            productPrice: 1000000,
            productQuantity: 11,
            productType: 'Ưa bóng',
            productImage: 'https://i.pinimg.com/236x/36/9c/ad/369cad9970a7885fccd7ed52978a92fd.jpg',
            _id: new ObjectId('660cc49afe65904df341d2bb')
            },....]
        ]*/

        //Làm phảng mảng, tối đa 2 cấp : biến một mảng chứa các mảng con (hoặc mảng con của mảng con)
        // thành một mảng duy nhất không có mảng con nào bên trong
        const lstProductObj = products.flat();  // console.log("lstProductObj=>>", lstProductObj);

        //Mảng chứa các sản phẩm để lặp bảng thống kê
        const lstpdTK = [];

        // Lặp qua từng sản phẩm để tính tổng số lượng theo từng ID
        lstProductObj.forEach(product => { //product là một item obj của lstProductObj
            //Trích xuất các thuộc tính từ object, trả về giá trị của các thuộc tính của các item product được duyệt qua
            const { productId, productName, productQuantity } = product;
            //Kiểm trả xem sản phẩm trong kho thống kê đã tồn tại chưa, 
            //đã tồn tại cộng dồn số lượng ngược lại thì thêm mới sản phẩm đó vào kho TK
            const existsProduct = lstpdTK.find(item => item.id === productId);
            if (existsProduct) {
                existsProduct.quantity += productQuantity;
            } else {
                const pdtk = {
                    id: productId,
                    quantity: productQuantity,
                    name: productName
                }
                lstpdTK.push(pdtk);
            }
        });

        console.log("lstpdTK====>", lstpdTK);

        // Sắp xếp mảng lstpdTK theo số lượng giảm dần
        lstpdTK.sort((a, b) => b.quantity - a.quantity);

        // Lấy 10 sản phẩm có số lượng cao nhất
        const top10Products = lstpdTK.slice(0, 10);
        if (!top10Products) {
            throw new Error("Lỗi hệ thống. Thử lại sau");
        }

        let property = [];
        for (let i = 0; i < top10Products.length; i++) {
            const pd = {
                propertyName: top10Products[i].name,
                propertyValue: top10Products[i].quantity
            }
            property.push(pd);
        }

        const statistic = new StatisticModal({
            name: "Top 10 sản phẩm bán chạy",
            properties: property,
            create_At: (date.getHours()) + ":" + (date.getMinutes()) + ":"
                + (date.getSeconds()) + " - " + daysOfWeek[date.getDay()] + ", " + date.getDate()
                + "/" + (date.getMonth() + 1) + '/' + date.getFullYear()
        })
        const result = await statistic.save();
        if (!result) {
            throw new Error("Lỗi hệ thống. Thử lại sau");
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


/**THỐNG KÊ DOANH THU THEO NGÀY*/

module.exports = { spTonKho, top10BanChay }