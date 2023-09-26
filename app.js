require("dotenv").config();
const express=require('express')
const app=express();
const path=require('path')
const session=require('express-session')
const { v4: uuid4 } = require("uuid");
const nocache=require('nocache')
const MongoDBStore = require('connect-mongodb-session')(session);




// mongodb config folder import here
const connectDB=require('./config/connect')

// import routes
const userRoutes=require('./routes/userRouter')


// global midlleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



// view engine set up
app.set("views", path.join(__dirname, "views"));
app.set("view engine", 'ejs');
app.use(nocache())


// session creation

app.use(
    session({
      name: 'sessions',
      secret: uuid4(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, 
      },
    })
  );


app.use('/',userRoutes)




//server creation and connecting with cloud mongodb atlas with the help of mongoose

const port=process.env.Port||4000
const start=async()=>{
try {
  await connectDB(process.env.MONGO_URI)
  app.listen(port,()=>{console.log("server started.....");})

} catch (error) {
   console.error('Error connecting to the database:', err);
  
}
}

start()