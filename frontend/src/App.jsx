import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import heroIllustration from "./assets/hero-illustration.svg";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const loadPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to load posts", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const addPost = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      window.alert("Please enter both a title and content before publishing.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("/posts", {
        title: trimmedTitle,
        content: trimmedContent,
      });

      setTitle("");
      setContent("");
      await loadPosts();
    } catch (error) {
      console.error("Failed to publish post", error);
      window.alert("Publish failed. Make sure the backend server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`/posts/${id}`);
      await loadPosts();
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const handleLogin = (email) => {
    setUserName(email.split("@")[0]);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main id="home" className="app-container">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-badge">✨ Welcome back, {userName || "friend"}</span>
            <h1>Share your stories with confidence</h1>
            <p>
              Create, organize, and revisit your thoughts in a clean experience made for everyday writing.
            </p>
            <div className="hero-stats">
              <div>
                <strong>{posts.length}</strong>
                <span>posts</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>focus</span>
              </div>
            </div>
          </div>

          <img src={heroIllustration} alt="Blog illustration" className="hero-illustration" />
        </section>

        <section className="form-section">
          <div className="section-heading">
            <div>
              <p className="section-label">New post</p>
              <h2>Write something fresh</h2>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              placeholder="A catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="What do you want to share today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button className="publish-btn" onClick={addPost} disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish post"}
          </button>
        </section>

        <section id="posts" className="posts-section">
          <div className="section-heading posts-heading">
            <div>
              <p className="section-label">Recently published</p>
              <h2>Your posts</h2>
            </div>
            <span className="posts-pill">{posts.length} total</span>
          </div>

          {isLoadingPosts ? (
            <div className="status-card">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="status-card empty-state">
              <h3>No posts yet</h3>
              <p>Your first post will appear here once you publish it.</p>
            </div>
          ) : (
            posts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-card__header">
                  <h3>{post.title}</h3>
                  <span className="post-dot" />
                </div>
                <p>{post.content}</p>
                <button className="delete-btn" onClick={() => deletePost(post.id)}>
                  Delete
                </button>
              </article>
            ))
          )}
        </section>

        <section className="info-grid">
          <article id="about" className="info-card">
            <h3>About</h3>
            <p>Write, share, and manage your posts with a simple and modern blogging experience.</p>
          </article>

          <article id="contact" className="info-card">
            <h3>Contact</h3>
            <p>Questions or feedback? Reach out and let us know how we can improve the app.</p>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;