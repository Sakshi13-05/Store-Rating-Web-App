const db = require("../config/db");

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
module.exports = {
    getDashboardStats, getAllUsers
};