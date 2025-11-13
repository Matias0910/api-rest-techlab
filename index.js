import "dotenv/config";
import express from "express";

const app = express();

// --- Middleware para PARSEAR el Cuerpo de la Solicitud (JSON/Form) ---
// **CORRECCIÓN** para solucionar el 'TypeError: Cannot destructure property email of req.body as it is undefined.'
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// --- Importaciones de Rutas y Middlewares ---

// **CORRECCIÓN** para solucionar el 'ERR_MODULE_NOT_FOUND'. Se unifica la ruta de importación.
import { verifyToken } from "./src/middlewares/verify-token.js"; 
import notFound from "./src/middlewares/not-found.js";
import productsRouter from "./src/routes/products.router.js";
import authRouter from "./src/routes/auth.router.js";


// --- Definición de Rutas ---

// Ruta de Bienvenida
app.get("/", (req, res) => {
    res.json({ message: "Bienvenido a mi API REST con Node.js y Firebase" });
});

// 1. Rutas de AUTENTICACIÓN
// Estas rutas (como /login y /register) NO deben usar verifyToken.
app.use('/api/auth', authRouter);

// 2. Rutas de PRODUCTOS
// **CORRECCIÓN** Se aplica el middleware verifyToken SOLO a las rutas que lo necesitan
// (en este caso, todas las rutas del productsRouter, montadas bajo /api/products).
app.use('/api/products', verifyToken, productsRouter);


// Middleware para manejar rutas no encontradas (404)
app.use(notFound);


// --- Inicialización del Servidor ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Servidor corriendo en: http://localhost:${PORT}`));