const { faker } = require('@faker-js/faker');  //npm faker
const mysql      = require('mysql2');
const express = require("express");
const app = express();
const path = require("path"); 
const methodOverride = require("method-override");
let port = "3000";

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({ 
  host :'******',     //enter your host:, user:, password:
  user: '*****',
  database: 'delta_app',
  password : '**********'
});


// let getRandomUser = () => {
//     return [
//        faker.string.uuid(),
//        faker.internet.username(), 
//        faker.internet.email(),
//        faker.internet.password(),
//     ];
//   }

// let data = [];
// for(let i=0; i<=100 ; i++ ){
//   data.push(getRandomUser());
// }

// try{
//   connection.query( q ,[data], (err,result)=>{
//     if (err)  throw err;          
//     console.log("Result:", result);
//    })
// }
// catch(err){          
// console.log(err);
// }
// connection.end();
// connection.end();


app.get("/user/new",(req,res)=>{  //new user form
   res.render("new.ejs");
})

app.post("/user/post",(req,res)=>{    //adding new user
  let newid = faker.string.uuid();
  // req.body.username;
 let data= [newid , req.body.username, req.body.email, req.body.password]
  let q = ` INSERT INTO user(id, username,email , password) VALUES (? , ? , ? , ?)`;
  try{
      connection.query( q , data ,(err,result)=>{
      if (err)  throw err;          
      res.send(result);
      })
    }
  catch(err){          
      console.log(err);
      res.send("Some err in data");
  }
})

app.get("/",(req,res)=>{           //homePageRoute
  let q = ` SELECT count(*) FROM user`;
  try{
      connection.query( q , (err,result)=>{
      if (err)  throw err;          
      let count= result[0]["count(*)"];
      // res.send(result[0]["count(*)"].toString());
      res.render("home.ejs",{count});
      })
    }
  catch(err){          
      console.log(err);
      res.send("Some err in data");
  }

});

app.get("/user", (req,res)=>{   //ALL USERS
   let q = ` SELECT * FROM user`;
   try{
    connection.query( q , (err,users)=>{
    if (err)  throw err;          
    // console.log(users);
    // res.send(users)
    res.render("show.ejs",{users});
    })
  }
catch(err){          
    console.log(err);
    res.send("Some err in data");
}
});

app.get("/user/:id/edit",(req,res)=>{   //Display edit page
  let {id} = req.params;
  let q = `SELECT * FROM user 
           WHERE id = "${id}" `; 
  try{
      connection.query( q , (err,result)=>{   
        if (err)  throw err; 
        let user = result[0]; 
        res.render("edit.ejs", {user});
      
      })
  }
  catch(err){          
      console.log(err);
      res.send("Some err in data");
  }
 
})

app.patch("/user/:id",(req,res)=>{     //performs editing
  let {id} = req.params;
  let {password :formPass ,username :newUsername} = req.body;
  let q = `SELECT * FROM user 
  WHERE id = "${id}" `; 
try{
connection.query( q , (err,result)=>{   
  if (err)  throw err; 
  let user = result[0]; 
  if(formPass != user.password){
   res.send("Wrong Password");
  }else{
    let q2 = `UPDATE user SET username = "${newUsername}" WHERE id = "${id}"`;
    connection.query(q2 ,(err, result)=>{
      if(err) throw err;
      res.redirect("/user");
    })
  }

  });
}
catch(err){          
console.log(err);
res.send("Some err in data");
}
})

app.delete("/user/:id/delete",(req,res)=>{   //delete user
  let {id} = req.params;
  let q = `DELETE FROM user 
  where id = ?`
  try{
   connection.query(q,[id],(err,result)=>{
    if (err)  throw err; 
    res.redirect("/user")
   });
  }
  catch(err){
    console.log(err); 
  }

})



app.listen(port,()=>{
  console.log(`Server is lestining at port ${port}`);
})



