const CateModal = require("./CateModal");
const ProductModal = require('../products/ProductModal');

//Lay tat ca danh muc
const getAll = async () => {
    try {
        const cate = await CateModal.find();
        if (!cate) {
            throw new Error("Loi khong kay duoc danh muc");
        }
        return cate;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

//Lấy danh sách các danh mục
const getAllCate = async () => {
    try {
        const allCate = await CateModal.find();
        if (!allCate) {
            throw new Error("Không có danh sách nào tồn tại trong hệ thống");
        }
        const ProductOfCate = [];
        for (var cate of allCate) {
            const products = await getProductOfCate(cate._id);
            const categoryWithProductsDetails = {
                _id: cate._id,
                name: cate.name,
                description: cate.description,
                products: products
            };

            ProductOfCate.push(categoryWithProductsDetails);
        }

        if (!ProductOfCate || ProductOfCate.length === -1) {
            throw new Error("Khong tim thay san pham trong danh muc");
        }

        return ProductOfCate;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Lay san pham cua tung danh muc
const getProductOfCate = async (idCate) => {
    try {
        if (!idCate) {
            throw new Error("Invalid id");
        }
        const checkInCate = await CateModal.findById(idCate);
        if (!checkInCate) {
            throw new Error("This Category does not exist")
        } else {
            const products = await ProductModal.find({ categoryId: idCate });
            if (!products) {
                throw new Error("An error occurred while retrieving the product list")
            }
            return products;
        }

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Thêm một danh mục
const addNewCategory = async (name, description) => {
    try {
        const checkExits = await CateModal.findOne({ name: name });
        if (checkExits) {
            throw new Error("Danh mục đã tồn tại. Vui lòng nhập tên danh mục khác!");
        }

        const newCate = new CateModal({
            name: name,
            description: description ? description : CateModal.description
        });

        const result = await newCate.save();
        if (!result) {
            throw new Error("Thêm thất bại, thử lại sau!");
        }
        return result;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//Cập nhật thông tin danh mục
const updateCate = async (idCate, name, description) => {
    try {
        if (!idCate) {
            throw new Error("Invalid id");
        } else {
            const newInforCate = await CateModal.findOne({ _id: idCate });
            if (!newInforCate) {
                throw new Error("No valid information found");
            }

            const product = await ProductModal.findById({ categoryId: idCate });
            if (product) {
                throw new Error("There are products that exist in this category. Please move all products to the appropriate category before updating!")
            } else {

                newInforCate.name = name || newInforCate.name;
                newInforCate.description = description || newInforCate.description;

                const result = await newInforCate.save();
                if (!result) {
                    throw new Error("No valid results found");
                }
                return result;
            }
        }

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}


//XOA DANH MUC
const deleteOneCate = async (idCate) => {
    try {
        if (!idCate) {
            throw new Error("Invalid id");
        } else {
            const category = await CateModal.findById(idCate);
            if (!category) {
                throw new Error("Please check again");
            } else {
                const product = await ProductModal.findOne({ categoryId: idCate });
                if (product) {
                    throw new Error("There are products that exist in this category. Please move all products to the appropriate category before deleting");
                }
                const result = await CateModal.deleteOne({ _id: idCate });
                if (!result) {
                    throw new Error("This category cannot be deleted because there are existing products");
                }
                return result;
            }
        }
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

module.exports = { getAll, getAllCate, getProductOfCate, addNewCategory, updateCate, deleteOneCate };