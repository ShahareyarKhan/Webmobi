const express=require('express');
const app=express();
const port=3000;
const { createUserTable } = require('./models/User');
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('hello world');
})

app.use('/api/auth', require('./routes/auth'));

app.listen(port,()=>console.log(`server is running on ${port}`))