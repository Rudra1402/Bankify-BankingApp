require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')

const admin = require('firebase-admin')
// const serviceAccountFirebase = require('./banking-app-b30cb-firebase-adminsdk-mm73m-1967c5c1f4.json')
const serviceAccountFirebase = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

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