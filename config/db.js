const Sequelize = require('sequelize');
const sequelize = new Sequelize('*****', '*****', '*****', {
	host: 'localhost',
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
});

const connexion = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (err) {
		console.error('Unable to connect to the database:', err);
	}
};

connexion();

module.exports = sequelize;
