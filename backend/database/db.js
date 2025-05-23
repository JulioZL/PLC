//import { Sequelize } from 'sequelize';

//// Configuración para conectar con PostgreSQL
//const db = new Sequelize('neondb', 'neondb_owner', 'npg_jSdDieh6axG4', {
//    host: 'ep-solitary-sound-a55lqwno-pooler.us-east-2.aws.neon.tech',
//    dialect: 'postgres', // Cambiar a postgres
//    dialectOptions: {
//        ssl: {
//            require: true, // Requiere SSL
//            rejectUnauthorized: false, // Permitir SSL no autorizado
//        },
//    },
//});

//export default db;

import { Sequelize } from 'sequelize';

<<<<<<< HEAD
// Configuración para conectar con PostgreSQL
const db = new Sequelize('neondb', 'neondb_owner', 'npg_jSdDieh6axG4', {
    host: 'ep-solitary-sound-a55lqwno-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
=======
const db = new Sequelize('PLCdb', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
>>>>>>> 723b4a623f26293aa3d384ba2508cb7be39e4b32
});

export default db;