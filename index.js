import express from "express";
import notFound from "./src/middlewares/not-found.js";
const app = express();

app.use((req, res, next) => {
    // res.json({ message: "Api en mantenimiento" });
    console.log(req.method);
    next();
});

app.get("/", (req, res) => {
    res.json({ message: "Bienvenido a mi API REST con Node.js y Firebase" });
});

app.use(notFound);

const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));