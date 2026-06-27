const db = require("../config/db");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        // Check required fields
        if (!name || !email || !password || !address) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if email already exists
        const checkQuery = "SELECT * FROM users WHERE email = ?";

        db.query(checkQuery, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err,
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists",
                });
            }

            // Hash Password
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery =
                "INSERT INTO users(name,email,password,address,role) VALUES(?,?,?,?,?)";

            db.query(
                insertQuery,
                [name, email, hashedPassword, address, "user"],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Registration Failed",
                            error: err,
                        });
                    }

                    res.status(201).json({
                        message: "User Registered Successfully",
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = { signup };