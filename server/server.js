const express = require('express')
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://dilyan:karlovo1@cluster0-5wm0k.mongodb.net/test?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB Connected!'))
.catch(err => {
  console.log(`DB Connection Error: ${err.message}`);
});

mongoose.connection.once('open', () => {
  mongoose.set('useFindAndModify', false);
  console.log('connected to the database')
})

const cors = require('cors')
const schema = require('./schema')
const app = express()
app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(8080, () => console.log('listening to port 8080'))
