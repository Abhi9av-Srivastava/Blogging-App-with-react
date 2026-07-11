const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Get all posts
app.get("/posts",(req,res)=>{

    db.query(
        "SELECT * FROM posts ORDER BY id DESC",
        (err,result)=>{

            if(err)
                res.status(500).send(err);

            else
                res.json(result);
        }
    );

});

// Create post

app.post("/posts",(req,res)=>{

    const {title,content}=req.body;


    db.query(
        "INSERT INTO posts(title,content) VALUES(?,?)",
        [title,content],

        (err,result)=>{

            if(err)
                res.status(500).send(err);

            else
                res.json({
                    message:"Post created"
                });

        }
    );

});

// Delete post

app.delete("/posts/:id",(req,res)=>{

    const id=req.params.id;


    db.query(
        "DELETE FROM posts WHERE id=?",
        [id],

        (err,result)=>{

            if(err)
                res.status(500).send(err);

            else
                res.json({
                    message:"Deleted"
                });

        }
    );

});

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});