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

    const { search = "", category = "all" } = req.query;

    let query = `
        SELECT *
        FROM stores
        WHERE
        (name LIKE ? OR email LIKE ? OR address LIKE ?)
    `;

    const params = [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
    ];

    if (category !== "all") {
        query += " AND category = ?";
        params.push(category);
    }

    query += " ORDER BY created_at DESC";

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json(result);
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
module.exports = { addStore, getAllStores, assignStoreOwner };