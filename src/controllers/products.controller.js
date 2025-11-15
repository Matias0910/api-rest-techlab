import * as Model from "../models/Product.js";

export const getAllProducts = async (req, res) => {
    const { category } = req.query;

    if (category) {
        const productsByCategory = await Model.getProductsByCategory(category);
        
        if (productsByCategory.length === 0) {
            return res.status(404).json({ error: `No se encontraron productos en la categoría: ${category}` });
        }

        return res.json(productsByCategory);
    }
    
    const products = await Model.getAllProducts();
    res.json(products);
};


export const searchProducts = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        res.status(400).json({ error: "El parámetro 'name' es obligatorio" });
        return;
    }

    const products = await Model.getAllProducts(); 

    const filteredProducts = products.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
    if (filteredProducts.length === 0) {
        res.status(404).json({ error: "No se encontraron productos que coincidan con la búsqueda" });
        return;
    }
    res.json(filteredProducts);
}


export const getProductById = async (req, res) => {
    const {id} = req.params;

    const product = await Model.getProductById(id);

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
};


export const createProduct = async (req, res) => {
    // Incluye imageUrl
    const { name, price, categories, stock, imageUrl } = req.body; 

    if (!name || price === undefined || !categories || stock === undefined || !imageUrl) {
        return res.status(422).json({ error: "El nombre, precio, categorías, stock e URL de imagen son obligatorios" });
    }
    
    const product = await Model.createProduct({ name, price, categories, stock, imageUrl }); 

    if (!product) {
        return res.status(500).json({ error: "Error al crear el producto en la base de datos." });
    }

    res.status(201).json(product);
};


export const updateProduct = async (req, res) => {
    const {id} = req.params;
    // Incluye imageUrl
    const { name, price, categories, stock, imageUrl } = req.body; 

    if (!name || price === undefined || !categories || stock === undefined || !imageUrl) {
        return res.status(422).json({ error: "El nombre, precio, categorías, stock e URL de imagen son obligatorios" });
    }

    const updated = await Model.updateProduct(id, { name, price, categories, stock, imageUrl });
    
    if (!updated) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updated);
};


export const updatePatchProduct = async (req, res) => {
    const {id} = req.params;
    
    const data = {};
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.price !== undefined) data.price = req.body.price;
    if (req.body.categories !== undefined) data.categories = req.body.categories;
    if (req.body.stock !== undefined) data.stock = req.body.stock;
    // Incluye imageUrl
    if (req.body.imageUrl !== undefined) data.imageUrl = req.body.imageUrl;

    if (Object.keys(data).length === 0) {
        return res.status(422).json({ error: "No se proporcionaron datos para actualizar" });
    }

    const updated = await Model.updatePatchProduct(id, data);
    
    if (!updated) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updated);
};


export const deleteProduct = async (req, res) => {
    const {id} = req.params;

    const deleted = await Model.deleteProduct(id);

    if (!deleted) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente" });
};
