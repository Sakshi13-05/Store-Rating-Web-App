const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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
                console.error("DB Error (Signup Check):", err);
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

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required"
        });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err, result) => {

        if (err) {
            console.error("DB Error (Login):", err);
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    });
};

module.exports = { signup, login };