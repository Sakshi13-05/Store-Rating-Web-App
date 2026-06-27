const bcrypt = require("bcryptjs");

bcrypt.hash("Owner@123", 10).then(console.log);