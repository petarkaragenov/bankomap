const mongoose = require('mongoose')

const licensedBankSchema = mongoose.Schema({
    name: { type: String, trim: true },
    web: { type: String, trim: true },
    address: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    fax: { type: String, trim: true },
    swift: { type: String, trim: true }
})

const LicensedBank = mongoose.model('LicensedBank', licensedBankSchema, 'licensed_banks')

module.exports = LicensedBank