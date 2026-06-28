const db = require("../config/db");

const getOwnerDashboard = (req, res) => {

    const ownerId = req.user.id;

    const query = `
        SELECT
            s.name AS storeName,
            s.category,
            s.address,
            s.created_at,

            IFNULL(ROUND(AVG(r.rating),1),0) AS averageRating,
            COUNT(r.id) AS totalRatings

        FROM stores s

        LEFT JOIN ratings r
        ON s.id = r.store_id

        WHERE s.owner_id = ?

        GROUP BY s.id
    `;

    db.query(query, [ownerId], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "No store assigned."
            });
        }

        res.json(result[0]);

    });

};

module.exports = {
    getOwnerDashboard
};