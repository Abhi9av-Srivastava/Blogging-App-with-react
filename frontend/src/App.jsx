import {useEffect,useState} from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import "./App.css";


function App(){


const [posts,setPosts]=useState([]);

const [title,setTitle]=useState("");

const [content,setContent]=useState("");



const loadPosts=async()=>{

try {
const res = await axios.get("/posts");
setPosts(res.data);
} catch (error) {
console.error("Failed to load posts", error);
}

};



useEffect(()=>{
void loadPosts();
},[]);



const addPost=async()=>{

const trimmedTitle = title.trim();
const trimmedContent = content.trim();

if(!trimmedTitle || !trimmedContent){
window.alert("Please enter both a title and content before publishing.");
return;
}

try {
await axios.post("/posts", {
title: trimmedTitle,
content: trimmedContent
});

setTitle("");
setContent("");
await loadPosts();
} catch (error) {
console.error("Failed to publish post", error);
window.alert("Publish failed. Make sure the backend server is running.");
}


};



const deletePost=async(id)=>{

try {
await axios.delete(`/posts/${id}`);
await loadPosts();
} catch (error) {
console.error("Failed to delete post", error);
}

};



return(

<div>

<Navbar />

<div className="app-container">

<div className="app-header">
<h1>Blogging App</h1>
</div>

<div className="form-section">
<div className="form-group">
<input
placeholder="Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>
</div>

<div className="form-group">
<textarea

placeholder="Content"

value={content}

onChange={(e)=>setContent(e.target.value)}

/>
</div>

<button className="publish-btn" onClick={addPost}>
Publish
</button>
</div>

<div className="posts-section">
{
posts.length === 0 ? (
<p className="no-posts">No posts yet. Create your first post!</p>
) : (
posts.map(post=>(

<div className="post-card" key={post.id}>

<h2>{post.title}</h2>

<p>{post.content}</p>


<button
className="delete-btn"
onClick={()=>deletePost(post.id)}
>
Delete
</button>

</div>


))
)
}
</div>

</div>

</div>


)

}


export default App;