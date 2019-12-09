const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const BanksController = require('./controllers/BanksController')
const OfficesController = require('./controllers/OfficesController')

const PORT = process.env.PORT || 3000
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

app.use(cors())

app.get('/api/banks', BanksController.index)
app.get('/api/offices', OfficesController.index)

app.listen(PORT, () => console.log('Listening on port ' + PORT))