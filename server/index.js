require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')

const admin = require('firebase-admin')
const serviceAccountFirebase = require('./banking-app-b30cb-firebase-adminsdk-mm73m-1967c5c1f4.json')

const app = express()
const PORT = process.env.PORT || 8000
const url = process.env.ATLAS_URI

const userRoutes = require('./controllers/user.controller')
const accountRoutes = require('./controllers/account.controller')
const contactRoutes = require('./controllers/contact.controller')
const transactionRoutes = require('./controllers/transaction.controller')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountFirebase),
    storageBucket: 'gs://banking-app-b30cb.appspot.com'
});

mongoose.connect(url, {
    useNewUrlParser: true,
}).then(() => {
    console.log('MongoDB connected!')
}).catch((err) => {
    console.log('MongoDB error: ' + err)
})

app.get('/', (_, res) => {
    res.json({ name: 'Server' })
})

app.use('/api', userRoutes)
app.use('/api', accountRoutes)
app.use('/api', contactRoutes)
app.use('/api', transactionRoutes)

app.listen(PORT, console.log('Server running on PORT: ' + PORT))