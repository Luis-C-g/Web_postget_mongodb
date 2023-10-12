//conectar a mongo express y body

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const port = 5555 ;


//Conectar con Mongodb
mongoose.connect("mongodb+srv://user1:<12345>@mydatabase1.xm0aoya.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser:true});
const db = mongoose.connection;

const User = mongoose.model("User",{
    name:String,
    email:String,
});

app.use(bodyParser.urlencoded({extended:true}));


app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

//manejar el envio del form
app.post("/add", async(req,res)=>{
    const {name, email} = req.body;

    const newUser = new User({name,email});

    try{
        await newUser.save();
        console.log("Usuario agregado exitosamente");
        res.redirect("/");
    } catch(err) {
        console.error("Error insertando el documento:", err);
        res.status(500).send("Error agregando usuario");
    }
});


//Obtener el usuario agragado

app.get("/users/:userId", async (req,res)=>{
    try{
        const userID=req.params.userId;

        const user = await User.findById(userID);

        if(!user){
            return res.status(404).json({error:"Usuario no encontrado"});
        }

        res.json(user);
    } catch(err){
        console.error("Error mostrando usuario; ",err);
        res.status(500).json({error:"Error mostrando usuario"});
    }
})



//start el server

app.listen(port,()=>{
    console.log('Server is running on port');
});