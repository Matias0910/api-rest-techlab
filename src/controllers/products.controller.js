import * as Model from "../models/Product.js";

export const getAllProducts = async (req, res) => {
    const { category } = req.query;

    if (category) {
        const productsByCategory = await Model.getProductsByCategory(category);
        
        // Responder 404 si no se encuentran productos
        if (productsByCategory.length === 0) {
            return res.status(404).json({ error: `No se encontraron productos en la categoría: ${category}` });
        }

        return res.json(productsByCategory);
    }
    
    // Si no hay categoría, trae todos
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
    const id = req.params.id;

    const product = await Model.getProductById(id);

    if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
    }

    res.json(product);
};

export const createProduct = async (req, res) => {
    const {name, price, categories} = req.body;

    if (!name || price === undefined || !categories) {
         return res.status(400).json({ error: "El nombre, precio y categorías son obligatorios" });
    }

    const product = await Model.createProduct({name, price, categories});
    res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const { name, price, categories } = req.body;

    if (!name || price === undefined || !categories) {
        return res.status(422).json({ error: "El nombre, precio y categorías son obligatorios" });
    }

    const updated = await Model.updateProduct(id, { name, price, categories });
    
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
    const id = req.params.id;

    const deleted = await Model.deleteProduct(id);

    if (!deleted) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(204).send();
};
