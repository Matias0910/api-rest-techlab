import "dotenv/config";
import express from "express";

const app = express();

// --- Middleware para PARSEAR el Cuerpo de la Solicitud (JSON/Form) ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// --- Importaciones de Rutas y Middlewares ---

import { verifyToken } from "./src/middlewares/verify-token.js"; 
import notFound from "./src/middlewares/not-found.js";
import productsRouter from "./src/routes/products.router.js";
import authRouter from "./src/routes/auth.router.js";
import cartRouter from "./src/routes/cart.router.js"; // ✅ NUEVO: Router del Carrito


// --- Definición de Rutas ---

// Ruta de Bienvenida
app.get("/", (req, res) => {
    res.json({ message: "Bienvenido a mi API REST con Node.js y Firebase" });
});

// 1. Rutas de AUTENTICACIÓN
app.use('/api/auth', authRouter);

// 2. Rutas de PRODUCTOS
app.use('/api/products', verifyToken, productsRouter);

// 3. RUTAS DE CARRITO (PROTEGIDAS)
app.use('/api/cart', verifyToken, cartRouter); 


// Middleware para manejar rutas no encontradas (404)
app.use(notFound);


// --- Inicialización del Servidor ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Servidor corriendo en: http://localhost:${PORT}`));