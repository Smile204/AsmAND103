const ProductModal = require("../products/ProductModal");
const TypeModal = require("./TypeModal");
const CateModal = require("../categories/CateModal");


//Lấy tất cả sản phẩm của type bằng name
const getTypeDetaiByName = async (idCate, typeName) => {
    try {
        if (!idCate) {
            throw new Error("Id không hợp lệ");
        }
        //Kiểm tra sự tồn tại của danh mục
        const cate = await CateModal.findById({ _id: idCate });
        if (!cate) {
            throw new Error("Danh mục không tồn tại. Vui lòng kiểm tra lại");
        }

        //Lấy sản phẩm theo danh mục
        const productOfCate = await ProductModal.find({ categoryId: cate._id });
        if (!productOfCate) {
            throw new Error("Danh mục này chưa có sản phẩm tồn tại");
        }
        // console.log(productOfCate);

        var products = [];
        var currTypeId = "";
        if (typeName === "Tất cả") {
            currTypeId = await TypeModal.findOne({ name: typeName });
            if (!currTypeId) {
                throw new Error("Không tìm thấy type name này");
            }
            products = Promise.all(productOfCate.map(async (item) => {
                let typename = '';
                const type = await TypeModal.findById(item.typeId);
                if (type) {
                    typename = type.name;
                }
                let cateName = ''
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
            }));
            // console.log(products);
            return products;
        } else if (typeName === "Hàng mới về") {
            currTypeId = await TypeModal.findOne({ name: typeName });
            if (!currTypeId) {
                throw new Error("Không tìm thấy type name này");
            }
            products = await Promise.all(productOfCate.map(async (item) => {
                let typename = '';
                const type = await TypeModal.findById(item.typeId);
                if (type) {
                    typename = type.name;
                }
                let cateName = ''
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
            }));
            return products.reverse();
        } else if (typeName === "Ưa sáng") {
            currTypeId = await TypeModal.findOne({ name: typeName });
            if (!currTypeId) {
                throw new Error("Không tìm thấy type name này");
            }
            const pdOfTypeName = productOfCate.filter((item) => item.typeId.toString() === currTypeId._id.toString());
            // console.log("sản phẩm ưa sáng => ", pdOfTypeName);
            if (!pdOfTypeName) {
                throw new Error("Type này không có sản phẩm");
            }
            products = await Promise.all(pdOfTypeName.map(async (item) => {
                let typename = '';
                const type = await TypeModal.findById(item.typeId);
                if (type) {
                    typename = type.name;
                }
                let cateName = ''
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
            }));
            return products;
        } else if (typeName === "Ưa bóng") {
            currTypeId = await TypeModal.findOne({ name: typeName });
            if (!currTypeId) {
                throw new Error("Không tìm thấy type name này");
            }
            const pdOfTypeName = productOfCate.filter((item) => item.typeId.toString() === currTypeId._id.toString());
            // console.log("sản phẩm ưa sáng => ", pdOfTypeName);
            if (!pdOfTypeName) {
                throw new Error("Type này không có sản phẩm");
            }
            products = await Promise.all(pdOfTypeName.map(async (item) => {
                let typename = '';
                const type = await TypeModal.findById(item.typeId);
                if (type) {
                    typename = type.name;
                }
                let cateName = ''
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
            }));
            return products;
        }
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Get all type
const getAllType = async () => {
    try {
        const type = await TypeModal.find();
        if (!type) {
            throw new Error("Loi he thong. Thu lai sau");
        }
        return type;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

//Them mot type product
const addNewType = async (name, description) => {
    try {
        const newType = new TypeModal({
            name: name,
            description: description
        });
        const result = await newType.save();
        if (!result) {
            throw new Error("Add new type failed");
        }
        return newType;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};


//Lay product theo kieu bang id
const getPdOfType = async (_id) => {
    try {
        if (!_id) {
            throw new Error("This type not exits");
        }
        const checkType = await TypeModal.findById({ _id });
        if (!checkType) {
            throw new Error("This type not exits")
        } else {
            const pdType = await ProductModal.find({ typeId: _id });
            if (!pdType) {
                throw new Error("This type have not product");
            }
            return pdType;
        }
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Cap nhat product type
const updatePdType = async (idType, name, description) => {
    try {
        if (!idType) {
            throw new Error("Invalid id");
        }
        const type = await TypeModal.findById(idType);
        if (!type) {
            throw new Error("Type does not exist")
        } else {
            const product = await ProductModal.findOne({ typeId: idType });
            if (product) {
                throw new Error("Please convert products to another type before updating");
            }
            type.name = name || type.name;
            type.description = description || type.description;

            const result = await type.save();
            if (!result) {
                throw new Error("Internet error");
            }
            return result;
        }
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Xoa product type
const deleteOneType = async (idType) => {
    try {
        if (!idType) {
            throw new Error("Invalid id");
        } else {
            const category = await TypeModal.findById(idType);
            if (!category) {
                throw new Error("Please check again");
            } else {
                const product = await ProductModal.findOne({ categoryId: idType });
                if (product) {
                    throw new Error("There are products that exist in this category. Please move all products to the appropriate type before deleting");
                }
                const result = await TypeModal.deleteOne({ _id: idType });
                if (!result) {
                    throw new Error("This type cannot be deleted because there are existing products");
                }
                return result;
            }
        }
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


module.exports = { getTypeDetaiByName, getAllType, addNewType, getPdOfType, updatePdType, deleteOneType };
