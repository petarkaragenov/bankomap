const mongoose = require('mongoose')

const officeSchema = mongoose.Schema({
    title: { type: String, trim: true },
    info: { type: String, trim: true },
    address: { type: String, trim: true },
    coords: {
        lat: { type: String, trim: true },
        lng: { type: String, trim: true },
    },
    location: { type: String, trim: true },
    location_latin: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    fax: { type: String, trim: true },
    open: { type: String, trim: true },
    till_late: { type: Boolean, trim: true },
    saturday: { type: Boolean, trim: true },
    sunday: { type: Boolean, trim: true },
    name: { type: String, trim: true },
    name_latin: { type: String, trim: true },
    name_alt: { type: String, trim: true },
    name_alt_latin: { type: String, trim: true },
})

const Office = mongoose.model('Office', officeSchema)

module.exports = Office