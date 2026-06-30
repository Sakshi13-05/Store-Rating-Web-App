const db = require("../config/db");
const bcrypt = require("bcryptjs");

const getDashboardStats = (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS totalUsers FROM users",
        (err, userResult) => {

            if (err) return res.status(500).json(err);

            stats.totalUsers = userResult[0].totalUsers;

            db.query(
                "SELECT COUNT(*) AS totalStores FROM stores",
                (err, storeResult) => {

                    if (err) return res.status(500).json(err);

                    stats.totalStores = storeResult[0].totalStores;

                    db.query(
                        "SELECT COUNT(*) AS totalRatings FROM ratings",
                        (err, ratingResult) => {

                            if (err) return res.status(500).json(err);

                            stats.totalRatings = ratingResult[0].totalRatings;

                            res.json(stats);
                        }
                    );
                }
            );
        }
    );
};

const getAllUsers = (req, res) => {
    const { search = "", role = "" } = req.query;

    let query = `
SELECT id, name, email, address, role
FROM users
WHERE
(name LIKE ? OR email LIKE ? OR address LIKE ?)
`;

    const params = [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
    ];

    if (role !== "") {
        query += " AND role = ?";
        params.push(role);
    }

    query += " ORDER BY created_at DESC";

    db.query(query, params, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

const addUser = (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // Check required fields
        if (!name || !email || !password || !address || !role) {
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
                [name, email, hashedPassword, address, role],
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

}
const getOwners = (req, res) => {

    const query = `
        SELECT id, name
        FROM users
        WHERE role = 'owner'
        ORDER BY name ASC
    `;

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });

};
const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, address, role } = req.body;

    if (!name || !email || !address || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'UPDATE users SET name = ?, email = ?, address = ?, role = ? WHERE id = ?';
    db.query(query, [name, email, address, role, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User updated successfully.' });
    });
};

const deleteUser = (req, res) => {
    const { id } = req.params;

    // Remove ratings by this user first to maintain referential integrity
    db.query('DELETE FROM ratings WHERE user_id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        db.query('DELETE FROM users WHERE id = ?', [id], (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ message: 'User deleted successfully.' });
        });
    });
};

module.exports = {
    getDashboardStats, getAllUsers, addUser, getOwners, updateUser, deleteUser,
};