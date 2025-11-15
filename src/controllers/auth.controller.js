import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/User.js";

export const register = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(422).json({ message: "El email y la contraseña son obligatorios" });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        return res.status(409).json({ message: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 8); 

    const user = await createUser(email, passwordHash);

    if (!user) {
        return res.status(503);
    }

    res.status(201).json({id: user.id, email: user.email});
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "El email y la contraseña son obligatorios" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Duración del Token extendida a 7 días
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d', 
    });

    res.json({ token });
};
