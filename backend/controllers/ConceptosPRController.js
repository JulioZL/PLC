import db from "../database/db.js";
import { Sequelize } from "sequelize";
import ConceptosPRModel from "../models/ConceptosPRModel.js";

export const getAllPrendas = async (req, res) => {
    try {
        const conceptos = await ConceptosPRModel.findAll();
        res.json(conceptos);
    } catch (error) {
        res.json({ message: error.message });
    }
};