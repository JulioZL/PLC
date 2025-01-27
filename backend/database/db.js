//import { Sequelize } from 'sequelize';

//const db = new Sequelize('PLCdb', 'root', '123456', {
//    host: 'localhost',
//    dialect: 'mysql',
//});

//export default db;
import { Sequelize } from 'sequelize';

// Configuración de conexión usando variables de entorno
const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

export default db;
