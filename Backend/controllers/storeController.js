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
        WHERE (name LIKE ? OR address LIKE ?)
    `;

    const params = [
        `%${search}%`,
        `%${search}%`
    ];

    if (category !== "all") {
        query += " AND category = ?";
        params.push(category);
    }

    query += " ORDER BY created_at DESC";

    db.query(query, params, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });

};

module.exports = { addStore, getAllStores };