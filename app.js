require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./src/db/database');
const path = require('path');


app.use("/uploads", express.static(path.join(__dirname,'/src/uploads')));


//Form ve Json formatında gelen istekleri ayrıştırır
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//rota bağlantıları
const router=require('./src/routers/router')

app.use('/',router);

sequelize.sync();


app.listen(process.env.PORT,()=> {
    console.log(`Server ${process.env.PORT} portundan ayaklandı`);
})