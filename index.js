const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.69qz5.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    const database = client.db('doctorportal')
    const appointmentOptionCollection = database.collection(
      'appointmentOptions',
    )
    const bookingCollection = database.collection('/bookings')

    console.log('Connected correctly to server')

    // Use aggregate to query multiple collection and then merge data
    // get all appointment
    // app.get('/appointmentOptions', async(req, res) => {
    //     // const date = req.query.date;
    //     // console.log(date);
    //     const query = {}
    //     const cursor = appointmentOptionCollection.find(query);
    //     const appointment = await cursor.toArray();

    //     //get the bookings of the provided date
    //     // const bookingQuery = {appointmentDate:date};
    //     // const alreadyBookedCursor = bookingCollection.find(bookingQuery)
    //     // const alreadyBooked = await alreadyBookedCursor.toArray()
    //     // console.log(alreadyBooked)

    //     //code carefully :D
    //     // appointment.forEach(appointments=>{
    //     //     const optionBooked = alreadyBooked.filter(book =>book.treatment  === appointments.name )
    //     //     const bookedSlots = optionBooked.map(book => book.slot)
    //     //     const remainingSlots = appointment.slots.filter(slot => !bookedSlots.includes(slot))
    //     //     // console.log(appointments.name,remainingSlots.length)
    //     //     appointments.slots=remainingSlots

    //     // })
    //     // res.send(appointment)
    //     // console.log('hit jairam gi')
    // })

    app.get('/appointmentOptions', async (req, res) => {
      const date = req.query.date
      console.log(date)
      const cursor = appointmentOptionCollection.find({})
      const options = await cursor.toArray()

      //not worked

      const bookingQuery = { appointmentDate: date }
      const alreadyBookedCursor = bookingCollection.find(bookingQuery)
      const alreadyBooked = await alreadyBookedCursor.toArray()
      options.forEach((option) => {
        const optionBooked = alreadyBooked.filter(
          (book) => book.treatment === option.book,
        )
        // console.log(optionBooked)
        const bookedSlots = optionBooked.map((book) => book.slot)
        const remainingSlots = option.slots.filter(
          (slot) => !bookedSlots.includes(slot),
        )
        option.slots = remainingSlots
        // console.log(bookedSlots)
      })
      res.send(options)
      //
      console.log('hit jairam gi')
    })

    app.post('/bookings', async (req, res) => {
      const booking = req.body
      console.log(booking)
      const query = {
        appointmentDate: booking.appointmentDate,
        treatment:booking.treatment,
        email:booking.email,
      }
      const alreadyBooked = await bookingCollection.find(query).toArray()
      if (alreadyBooked.length) {
        const message = `you already have a booking on ${booking.appointmentDate}`
        return res.send({ acknowledge: false, message })
      }else{

      }
      const result = await bookingCollection.insertOne(booking)
      res.json(result)
      console.log('hit from booking')
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(` app listening at http://localhost:${port}`)
})
