const db = require("../config/db");

const submitRating = (req, res) => {

    const userId = req.user.id;
    const { storeId, rating } = req.body;

    if (!storeId || !rating) {
        return res.status(400).json({
            message: "Store ID and Rating are required."
        });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Rating must be between 1 and 5."
        });
    }

    // Check user role
    const checkUserQuery = `
        SELECT role
        FROM users
        WHERE id = ?
    `;

    db.query(checkUserQuery, [userId], (err, userResult) => {

        if (err)
            return res.status(500).json(err);

        if (userResult.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (userResult[0].role !== "user") {
            return res.status(403).json({
                message: "Only users can submit ratings."
            });
        }

        // Check store exists
        const checkStoreQuery = `
            SELECT id
            FROM stores
            WHERE id = ?
        `;

        db.query(checkStoreQuery, [storeId], (err, storeResult) => {

            if (err)
                return res.status(500).json(err);

            if (storeResult.length === 0) {
                return res.status(404).json({
                    message: "Store not found."
                });
            }

            // Check existing rating
            const checkRatingQuery = `
                SELECT id
                FROM ratings
                WHERE user_id = ?
                AND store_id = ?
            `;

            db.query(checkRatingQuery, [userId, storeId], (err, ratingResult) => {

                if (err)
                    return res.status(500).json(err);

                if (ratingResult.length > 0) {

                    // Update existing rating
                    const updateQuery = `
                        UPDATE ratings
                        SET rating = ?
                        WHERE user_id = ?
                        AND store_id = ?
                    `;

                    db.query(updateQuery, [rating, userId, storeId], (err) => {

                        if (err)
                            return res.status(500).json(err);

                        return res.json({
                            message: "Rating updated successfully."
                        });

                    });

                } else {

                    // Insert new rating
                    const insertQuery = `
                        INSERT INTO ratings
                        (user_id, store_id, rating)
                        VALUES (?, ?, ?)
                    `;

                    db.query(insertQuery, [userId, storeId, rating], (err) => {

                        if (err)
                            return res.status(500).json(err);

                        return res.status(201).json({
                            message: "Rating submitted successfully."
                        });

                    });

                }

            });

        });

    });

};

module.exports = {
    submitRating
};