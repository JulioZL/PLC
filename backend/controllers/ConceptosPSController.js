import db from "../database/db.js";
import { Sequelize } from "sequelize";
import ConceptosPSModel from "../models/ConceptosPSModel.js";

export const getAllConceptos = async (req, res) => {
    try {
        const conceptos = await ConceptosPSModel.findAll(); // Obtiene todos los conceptos
        res.json(conceptos);
    } catch (error) {
        res.json({ message: error.message });
    }
};