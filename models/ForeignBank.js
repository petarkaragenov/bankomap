const mongoose = require('mongoose')

const foreignBankSchema = mongoose.Schema({
    name: { type: String, trim: true },
    web: { type: String, trim: true },
    address: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    fax: { type: String, trim: true },
    swift: { type: String, trim: true }
})

const ForeignBank = mongoose.model('ForeignBank', foreignBankSchema, "foreign_banks")

module.exports = ForeignBank