const ProductModal = require("./ProductModal");
const TypeModal = require("../types/TypeModal");
const CategoryModal = require("../categories/CateModal");
const CartModal = require("../carts/CartModal");
const CateModal = require("../categories/CateModal");


//Thêm sản phẩm vào database
const addNewProduct = async (newName, newPrice, newQuantity, NewImages, newDescription, newSize, newOrigin, typeId, categoryId) => {
    try {
        if (!typeId || !categoryId) {
            throw new Error("Id khong hop le");
        }

        const typeInDB = await TypeModal.findById(typeId);
        if (!typeInDB) {
            throw new Error("Khong tim thay product type");
        }

        const categoryInDB = await CategoryModal.findById(categoryId);
        if (!categoryInDB) {
            throw new Error("Khong tim thay danh muc");
        }

        const newProduct = new ProductModal({
            name: newName,
            price: newPrice,
            quantity: newQuantity,
            images: NewImages,
            description: newDescription,
            size: newSize,
            origin: newOrigin,
            typeId: typeId,
            categoryId: categoryId,
            hiddenProduct: false
        });

        const result = await newProduct.save();
        if (!result) {
            throw new Error("Loi he thong. Them that bai");
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Cập nhật sản phẩm
const updateProduct = async (idProduct, newName, newPrice, newQuantity, NewImages, newDescription,
    newSize, newOrigin, newTypeId, newCategoryId, hiddenProduct) => {
    try {
        const productInDB = await ProductModal.findById(idProduct);
        if (!productInDB) {
            throw new Error("Khong tim thay san pham");
        }

        const typeInDB = await TypeModal.findById(newTypeId);
        if (!typeInDB) {
            throw new Error("Khong tim thay product type");
        }

        const cateInDB = await CategoryModal.findById(newCategoryId);
        if (!cateInDB) {
            throw new Error("Khong tim thay danh muc");
        }

        productInDB.name = newName || productInDB.name;
        productInDB.price = newPrice || productInDB.price;
        productInDB.quantity = newQuantity || productInDB.quantity;
        productInDB.images = NewImages || productInDB.images;
        productInDB.description = newDescription || productInDB.description;
        productInDB.size = newSize || productInDB.size;
        productInDB.origin = newOrigin || productInDB.origin;
        productInDB.typeId = newTypeId || productInDB.typeId;
        productInDB.categoryId = newCategoryId || productInDB.categoryId;
        productInDB.hiddenProduct = hiddenProduct || productInDB.hiddenProduct;
        productInDB.updateAt = Date.now();

        const result = await productInDB.save();
        if (!result) {
            throw new Error("Loi he thong. Cap nhat that bai");
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Xóa sản phẩm
const deleteProduct = async (idProduct) => {
    try {
        const productInDB = await ProductModal.findById(idProduct);
        if (!productInDB) {
            throw new Error("Khong tim thay san pham");
        }

        productInDB.hiddenProduct = true;

        const result = await productInDB.save();
        if (!result) {
            throw new Error("Da xay ra loi vui long thu lai sau");
        }

        const lstCurrPd = await ProductModal.find({ hiddenProduct: false });
        if (!lstCurrPd) {
            throw new Error("Khong tim thay san pham nao");
        }

        return lstCurrPd;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


const getProductDetail = async (idProduct) => {
    try {
        if (!idProduct) {
            throw new Error("Id không hợp lệ");
        }
        const product = await ProductModal.findById({ _id: idProduct });
        if (!product) {
            throw new Error("Lấy sản phẩm thất bại");
        }
        const typePd = await TypeModal.findById(product.typeId);
        let type = "";
        if (!typePd) {
            throw new Error("Không tìm thấy thuộc tính này");
        } else {
            type = typePd.name;
            console.log(type)
        }
        const catePd = await CateModal.findById(product.categoryId);
        let category = '';
        if (!catePd) {
            throw new Error("Không tìm thấy danh mục này");
        } else {
            category = catePd.name;
            console.log(category)
        }

        const pd = {
            "_id": product._id,
            "name": product.name,
            "price": product.price,
            "quantity": product.quantity,
            "images": product.images,
            "description": product.description,
            "size": product.size,
            "origin": product.origin,
            "type": type,
            "category": category,
        }

        return pd;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Lay tat ca san pham
const getAllProduct = async () => {
    try {
        const result = await ProductModal.find({ hiddenProduct: false });
        if (!result) {
            throw new Error("Loi mang. Khong lay duoc san pham");
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Tim kiem san pham theo ten
const getProductDetailByName = async (name) => {
    try {
        if (!name || typeof name !== 'string') {
            throw new Error("Name không hợp lệ");
        }
        const result = await ProductModal.find({ name: { $regex: name, $options: 'i' } });
        if (!result) {
            throw new Error('Lỗi');
        }
        const product = await Promise.all(result.map(async (item) => {
            let typename = '';
            let cateName = ''
            const type = await TypeModal.findById(item.typeId);
            if (type) {
                typename = type.name;
            }
            const cate = await CateModal.findById(item.categoryId);
            if (cate) {
                cateName = cate.name;
            }
            return {
                "_id": item._id,
                "name": item.name,
                "price": item.price,
                "quantity": item.quantity,
                "images": item.images,
                "description": item.description,
                "size": item.size,
                "origin": item.origin,
                "type": typename,
                "category": cateName,
            }
        })
        )
        return product;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Xóa một sản phẩm bang cach thay doi trang thai
const deleteOneProduct = async (idProduct) => {
    try {
        var productinDB = await ProductModal.findById(idProduct);
        if (!productinDB) {
            throw new Error("Sản phẩm không tồn tại");
        }
        productinDB.hiddenProduct = true;

        const result = await productinDB.save();
        if (!result) {
            throw new Error("{Xóa thất bại");
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

module.exports = {
    getAllProduct, addNewProduct, updateProduct,
    deleteProduct, getProductDetail, getProductDetailByName,
    deleteOneProduct
};