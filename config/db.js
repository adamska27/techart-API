const Sequelize = require('sequelize');
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		dialect: 'postgres',
		operatorsAliases: false,
		// custom protocol; default: 'tcp'
		// postgres only, useful for Heroku
		protocol: null,
		// disable inserting undefined values as NULL
		// - default: false
		omitNull: true,

		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		}
	}
);

const connexion = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (err) {
		console.error('Unable to connect to the database:', err);
	}
};

connexion();

// Sync all defined models to the DB
// pass { force: true } in sync parameter will drop the table if it already exists
const sync = async () => {
	try {
		await sequelize.sync();
		console.log(
			'all tables has been successfully created, if one doesn\'t exist'
		);
	} catch (error) {
		console.log('This error occured: ', error);
	}
};

sync();

module.exports = sequelize;
