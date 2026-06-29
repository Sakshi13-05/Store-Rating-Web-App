const db = require("../config/db");

const getOwnerDashboard = (req, res) => {

    const ownerId = req.user.id;

    const query = ` SELECT
    s.id,
    s.name AS storeName,
    s.category,
    s.address,
    s.created_at,

    IFNULL(ROUND(AVG(r.rating), 1), 0) AS averageRating,
    COUNT(r.id) AS totalRatings

FROM stores s

LEFT JOIN ratings r
ON s.id = r.store_id

WHERE s.owner_id = ?

GROUP BY
    s.id,
    s.name,
    s.category,
    s.address,
    s.created_at`;

    db.query(query, [ownerId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error",
                error: err
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "No store assigned to this owner."
            });
        }

        res.status(200).json(result[0]);

    });

};

const getRatings = (req, res) => {

    const ownerId = req.user.id;

    const {
        search = "",
        sort = "latest"
    } = req.query;

    let orderBy = "r.created_at DESC";

    if (sort === "highest") {
        orderBy = "r.rating DESC";
    }

    if (sort === "lowest") {
        orderBy = "r.rating ASC";
    }

    const query = `
        SELECT
            r.id,
            u.name AS customerName,
            r.rating,
            r.created_at

        FROM ratings r

        JOIN users u
            ON r.user_id = u.id

        JOIN stores s
            ON r.store_id = s.id

        WHERE
            s.owner_id = ?
            AND u.name LIKE ?

        ORDER BY ${orderBy}
    `;

    db.query(
        query,
        [ownerId, `%${search}%`],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

};

module.exports = {
    getOwnerDashboard, getRatings
};