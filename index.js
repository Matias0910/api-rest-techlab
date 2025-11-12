import express from "express";
const app = express();

app.get("/", (req, res) => {
    res.send("Bienvenido a mi API REST con Express!");
})

const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));