const LicensedBank = require('../models/LicensedBank')
const ForeignBank = require('../models/ForeignBank')

module.exports = {
    async index(req, res) {
        try {
            const licensed = await LicensedBank.find({})
            const foreign = await ForeignBank.find({})
            return res.json({
                licensed, foreign, success: true
            })
        } catch (error) {
            return res.status(500).json({ 
                error: error.message,
                success: false
            })
        }
    }
}