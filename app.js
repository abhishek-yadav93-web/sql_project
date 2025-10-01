const sql=require("mysql2")
const { faker } = require('@faker-js/faker');
const express=require("express")
const app=express()
let port =8080
const path=require("path")
let methodOverride=require("method-override")
app.set("views engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
// let createRandomUser=()=> {
//   return [ faker.string.uuid(),
//      faker.internet.username(), 
//      faker.internet.email(), 
//      faker.internet.password()
//   ];
// }
// let userData=[]
// for (let i=1;i<=50;i++){
//     userData.push(createRandomUser())
// }
const connection=sql.createConnection({
    host:"localhost",
    user:"root"
})
// let q="insert into  user(id,userName,email,password) values ?";
// try{
//     connection.query(q,[userData],(err,res)=>{
//         if (err) throw err
//         console.log(res)
//     })
// }catch(err){
//     console.log(err)
// }
// connection.end()

app.get("/",(req,res)=>{
    let q="select count(*) from user";
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err
            //console.log(result[0]["count(*)"])
            let count=result[0]["count(*)"]
            res.render("home.ejs",{count})
        })
    }catch(err){
        console.log("something is error on database ")
        res.render("error.ejs")
    }
})
app.get("/user",(req,res)=>{
    let q="select * from user"
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err
            let data=result
            // for(let i=0;i<data.length;i++){
            //     console.log(data[i].id)
            // }
            res.render("showUsers.ejs",{data})
        })
    }catch(err){
        console.log(err)
        res.render("error.ejs")
    }
})
//get update route
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params
    console.log(id)
    let query=`select * from user where id='${id}'`;
    try{
        connection.query(query,(err,result)=>{
            if (err) throw err
            console.log(result)
            let data=result[0]
            res.render("edit.ejs",{data})
        })
    }catch(err){
        console.log(err)
        res.render("error.ejs")
    }
})
app.patch("/user/:id",(req,res)=>{
    let {id}=req.params
    let{userName:newuserName,email:newEmail,password:userPassword}=req.body
    let q=`select * from user where id='${id}'`
    try{
        connection.query(q,(err,result)=>{
            if (err) throw err
            let password=result[0].password
            if(userPassword===password){
                let qerr=`update user set userName='${newuserName}',email='${newEmail}' where id='${id}'`
                try{
                connection.query(qerr,(err,result)=>{
                    if(err) throw err
                    console.log(result)
                    res.send(`<h1>user name updated succesfully </h1>`)
                })}catch(err){
                    console.log(err)
                    res.send('something happens wrong')
                }
            }else{
                console.log("password does not matched")
            }
        })
    }catch(err){
        console.log(err)
    }
})
app.listen(port,()=>{
    console.log("connection is build on server")
})
