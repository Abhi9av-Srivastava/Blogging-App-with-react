const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Blogging app API is running" });
});

// Get all posts
app.get("/posts", (req, res) => {
  db.query("SELECT * FROM posts ORDER BY id DESC", (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to fetch posts" });
      return;
    }

    res.json(result);
  });
});

// Create post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required" });
    return;
  }

  db.query(
    "INSERT INTO posts(title,content) VALUES(?, ?)",
    [title, content],
    (err) => {
      if (err) {
        res.status(500).json({ error: "Failed to create post" });
        return;
      }

      res.status(201).json({ message: "Post created" });
    }
  );
});

// Delete post
app.delete("/posts/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM posts WHERE id=?", [id], (err) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete post" });
      return;
    }

    res.json({ message: "Deleted" });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});