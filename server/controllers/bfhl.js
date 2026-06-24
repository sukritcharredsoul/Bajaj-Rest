const { processData } = require("../services/hierarchyService");

exports.handleBFHL = (req, res) => {
    try {
        const { data } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input" });
        }

        const result = processData(data);

        return res.json({
            user_id: "sukrit Choudhary",
            email_id: "sukrit0978.be23@chitkara.edu.in",
            college_roll_number: "2310990978",
            ...result
        });

    } catch (err) {
        return res.status(500).json({ error: "Server error" });
    }
};