import { Sequelize } from 'sequelize';

// Configuraci�n para conectar con PostgreSQL
const db = new Sequelize('neondb', 'neondb_owner', 'npg_jSdDieh6axG4', {
    host: 'ep-solitary-sound-a55lqwno-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

export default db;
