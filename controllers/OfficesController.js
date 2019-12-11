const Office = require('../models/Office')

module.exports = {
    async index(req, res) {
        try {
            const allowed_queries = ['name', 'location', 'till_late', 'saturday', 'sunday']

            if (!req.query.name || !req.query.location) {
                return res.status(400).json({ error: 'Not enough data', success: false })
            }

            let provided_queries = req.query

            for (key in provided_queries) {
                if (!allowed_queries.includes(key)) delete provided_queries[key]
                if (key === 'name' || key === 'location') {
                    provided_queries[key] = provided_queries[key].replace(/\+/g, ' ')
                }
            }

            const offices = await Office.find(provided_queries)

            return res.json({ offices, success: true })
        } catch (error) {
            return res.status(500).json({ 
                error: error.message,
                success: false
            })
        }
    }
}
