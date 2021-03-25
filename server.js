var express=require('express');
var mysql=require('mysql');
var bodyparser=require('body-parser');
var db=require('./Mysetup/myurls');
var app=express();
var urlencodedParser = bodyparser.urlencoded({ extended: false })
var jsonparser=bodyparser.json();

const db1=mysql.createConnection(db);

db1.connect((err)=>{
    if (err) throw err;
    console.log("connected "+db1.threadId);
});

app.get('/',function(req,res){
    res.status(200).send("Hi, welcome to the Product crud app");
});

//sign up
app.post('/signup',jsonparser,(req,res)=>{
    var users={
        fullname:req.body.fullname,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password
    }

    console.log(users);

   
    setTimeout(function(){
        var sql='SELECT * FROM User WHERE email= ?';
        db1.query(sql,[users.email],(err,data,fields)=>{
            // console.log(data[0]);
            if(err) throw err;
            // console.log(data[0].email);
            // console.log(users.email);
            if(data[0]){
                var msg=users.email + " already exist";
                return res.status(500).send({error:true,message:msg});
            }
            else{
                db1.query('INSERT INTO User SET ?',[users],function(error,data){
                    if(err) throw err;
                    return res.status(200).send({success:true,message:"registration successfully"});
                });
            }
        });

    },3000);
    
});

//signin
app.post('/signin',jsonparser,(req,res)=>{
setTimeout(function(){
    const email1=req.body.email;
    const password1=req.body.password;
    var sql1='SELECT * FROM User WHERE email=?';
    db1.query(sql1,[email1],(err,data,fields)=>{
        console.log(data[0]);
        if(err) throw err;
        if(data[0].password === password1){
            console.log(data[0].password);
            return res.status(200).send({success:true,message:data[0].fullname +" signed in"})
        }
        else{
            return res.status(500).send({error:true,message:"Please try again"});
        }
    });

},2000);
});

//product create
app.post('/product/create',jsonparser,async (req,res)=>{
    var prod={
        productname:req.body.productname,
        productcode:req.body.productcode,
        price:req.body.price,
        category:req.body.category
    }

    var sql='SELECT * FROM Product WHERE productcode=?';
    db1.query(sql,[prod.productcode],(err,data)=>{
        if(err) throw err;

        if(data[0]){
            res.status(500).send({error:true,message:"Product already exist"});
        }
        else{
            db1.query('INSERT INTO Product SET ?',[prod],function(error,data){
                if(err) throw err;
                res.status(200).send({success:true,message:"Product created successfully"});
            });
        }
    });
});

//product list
app.get('/product/list',(req,res)=>{
    var sql='SELECT * FROM Product';
    db1.query(sql,(err,data)=>{
        if(err) throw err;
        if(data){
            return res.status(200).send({success:true,Products:data});
        }
        else{
            return res.status(500).send({error:true,message:"No products"});
        }
    });

});

//product list by id
app.get('/product/list/:id',jsonparser,(req,res)=>{

    var sql='SELECT * FROM Product WHERE id=?';
    db1.query(sql,[req.params.id],(err,data)=>{
        if(err) throw err;
        if(data){
            return res.status(200).send({success:true,Product:data});
        }
        else{
            return res.status(500).send({success:true,Message:"Product not found"});
        }

    });

});

//delete product by id
app.delete('/product/list/:id',(req,res)=>{
    var sql='DELETE FROM Product WHERE id=?';
    db1.query(sql,[req.params.id],(err,data)=>{
        if(err) throw err;
        return res.status(200).send({success:true,mesagges:"Successfully deleted"});
    });
});

//product update by id
app.put('/product/list/:id',jsonparser,(req,res)=>{
    var sql='UPDATE Product SET productname=?,productcode=?,price=?';
    db1.query(sql,[req.body.productname,req.body.productcode,req.body.price],(err,data)=>{
        if(err) throw err;
        return res.status(200).send({success:true,message:"Updated successfully"});
    });
});

app.listen(3003,function(){
    console.log("Port 3003 is listening");
});