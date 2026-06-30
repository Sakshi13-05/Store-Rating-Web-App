const db = require("../config/db");

const addStore = (req, res) => {
    console.log("===== ADD STORE API CALLED =====");

    const { name, email, address, category, ownerId } = req.body;

    if (!name || !email || !address || !category) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const checkQuery = "SELECT * FROM stores WHERE email = ?";

    db.query(checkQuery, [email], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {
            return res.status(400).json({
                message: "Store already exists"
            });
        }

        const insertQuery = `
        INSERT INTO stores
        (name,email,address,category,owner_id)
        VALUES(?,?,?,?,?)
        `;

        db.query(
            insertQuery,
            [name, email, address, category, ownerId || null],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "Store Added Successfully"
                });

            }
        );

    });

};

const getAllStores = (req, res) => {

    const { search = "", category = "all", currentUserId } = req.query;

    // Build the user-rating subquery only when a userId is provided
    const userRatingJoin = currentUserId
        ? `LEFT JOIN ratings AS ur ON ur.store_id = s.id AND ur.user_id = ?`
        : "";

    const userRatingSelect = currentUserId
        ? `, ur.rating AS userRating`
        : `, NULL AS userRating`;

    let query = `
        SELECT
            s.*,
            ROUND(COALESCE(AVG(r.rating), 0), 1) AS overallRating,
            COUNT(r.id) AS ratingCount
            ${userRatingSelect}
        FROM stores s
        LEFT JOIN ratings r ON r.store_id = s.id
        ${userRatingJoin}
        WHERE
        (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)
    `;

    const params = [];

    // The user-rating JOIN param must come before the WHERE params
    if (currentUserId) {
        params.push(currentUserId);
    }

    params.push(`%${search}%`, `%${search}%`, `%${search}%`);

    if (category !== "all") {
        query += " AND s.category = ?";
        params.push(category);
    }

    query += " GROUP BY s.id ORDER BY s.created_at DESC";

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json(err);

        // Normalise: convert null userRating to null (not 0) so frontend
        // can correctly distinguish "not rated" from "rated 0"
        const rows = result.map((store) => ({
            ...store,
            overallRating: store.overallRating ? Number(store.overallRating) : 0,
            ratingCount: Number(store.ratingCount),
            userRating: store.userRating !== null ? Number(store.userRating) : null,
        }));

        res.json(rows);
    });
};
const assignStoreOwner = (req, res) => {

    const { id } = req.params;
    const { ownerId } = req.body;

    if (!ownerId) {
        return res.status(400).json({
            message: "Owner is required"
        });
    }

    const query = `
        UPDATE stores
        SET owner_id = ?
        WHERE id = ?
    `;

    db.query(query, [ownerId, id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json({
            message: "Store Owner Assigned Successfully"
        });

    });

};
const updateStore = (req, res) => {
    const { id } = req.params;
    const { name, email, address, category } = req.body;

    if (!name || !email || !address || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'UPDATE stores SET name = ?, email = ?, address = ?, category = ? WHERE id = ?';
    db.query(query, [name, email, address, category, id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Store updated successfully.' });
    });
};

const deleteStore = (req, res) => {
    const { id } = req.params;

    // Delete ratings first to maintain referential integrity
    db.query('DELETE FROM ratings WHERE store_id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        db.query('DELETE FROM stores WHERE id = ?', [id], (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ message: 'Store deleted successfully.' });
        });
    });
};

module.exports = { addStore, getAllStores, assignStoreOwner, updateStore, deleteStore };