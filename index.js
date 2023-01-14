
const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.69qz5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db('doctorportal');
        const appointmentOptionCollection = database.collection('appointmentOptions');
        const bookingCollection = database.collection('/bookings')
        
        console.log('Connected correctly to server');
        
        // get all appointment
        app.get('/appointmentOptions', async(req, res) => {
            const cursor = appointmentOptionCollection.find({});
            const appointment = await cursor.toArray();
            res.send(appointment)
            console.log('hit jairam gi')
        })

        app.post('/bookings',async(req,res) =>{
            const booking = req.body;
            console.log(booking)
            const result = await bookingCollection.insertOne(booking)
            res.json(result)
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(` app listening at http://localhost:${port}`)
})
