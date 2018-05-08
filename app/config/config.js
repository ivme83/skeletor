require('dotenv').config();

module.exports = {
 	development: {
		"use_env_variable": "LOCALDB_URL",
		"dialect": "mysql",
		operatorsAliases: false, // disable aliases
	},
	test: {
		"use_env_variable": "TESTDB_URL",
		"dialect": "mysql",
		operatorsAliases: false, // disable aliases
	},
	production: {
		"use_env_variable": "JAWSDB_URL",
		"dialect": "mysql",
		operatorsAliases: false, // disable aliases
	}
};