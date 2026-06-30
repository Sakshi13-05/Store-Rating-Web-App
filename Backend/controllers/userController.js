const db = require("../config/db");
const bcrypt = require("bcryptjs");

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

const updateProfile = (req, res) => {
    const { userId, name, address } = req.body;

    if (!userId || !name || !address) {
        return res.status(400).json({ error: 'userId, name, and address are required.' });
    }
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ error: 'Name must be 20 to 60 characters.' });
    }
    if (address.length > 400) {
        return res.status(400).json({ error: 'Address must be max 400 characters.' });
    }

    const updateQuery = 'UPDATE users SET name = ?, address = ? WHERE id = ?';
    db.query(updateQuery, [name, address, userId], (err) => {
        if (err) return res.status(500).json(err);

        db.query(
            'SELECT id, name, email, address, role FROM users WHERE id = ?',
            [userId],
            (err2, result) => {
                if (err2) return res.status(500).json(err2);
                res.json({ message: 'Profile updated successfully.', user: result[0] });
            }
        );
    });
};

const changePassword = (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({ error: 'userId and password are required.' });
    }
    if (password.length < 8 || password.length > 16) {
        return res.status(400).json({ error: 'Password must be 8-16 characters.' });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({ error: 'Password must contain at least one uppercase letter.' });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return res.status(400).json({ error: 'Password must contain at least one special character.' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json(err);
        db.query('UPDATE users SET password = ? WHERE id = ?', [hash, userId], (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ message: 'Password changed successfully.' });
        });
    });
};

module.exports = {
    submitRating, updateProfile, changePassword
};