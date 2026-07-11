import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import heroIllustration from "./assets/hero-illustration.svg";
import heroPhoto from "./assets/hero.png";
import readingNook from "./assets/reading-nook.svg";
import writerSetup from "./assets/writer-setup.svg";
import journalCards from "./assets/journal-cards.svg";
import "./App.css";

const formatPostDate = (value) => {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const titleCharacterCount = title.length;
  const contentCharacterCount = content.length;
  const isPublishDisabled = isSubmitting || !title.trim() || !content.trim();
  const filteredPosts = posts.filter((post) => {
    const searchableText = `${post.title ?? ""} ${post.content ?? ""}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase().trim());
  });

  const loadPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (error) {
      console.error("Failed to load posts", error);
      setFeedback({ type: "error", message: "We could not refresh your posts right now." });
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
      setFeedback({ type: "error", message: "Please enter both a title and content before publishing." });
      return;
    }

    if (trimmedTitle.length > 80) {
      setFeedback({ type: "error", message: "Titles should stay under 80 characters for a cleaner layout." });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback({ type: "info", message: "Publishing your post..." });
      await axios.post("/posts", {
        title: trimmedTitle,
        content: trimmedContent,
      });

      setTitle("");
      setContent("");
      setFeedback({ type: "success", message: "Your post is live and ready to read." });
      await loadPosts();
    } catch (error) {
      console.error("Failed to publish post", error);
      setFeedback({ type: "error", message: "Publish failed. Make sure the backend server is running." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`/posts/${id}`);
      setFeedback({ type: "success", message: "Post removed from your collection." });
      await loadPosts();
    } catch (error) {
      console.error("Failed to delete post", error);
      setFeedback({ type: "error", message: "Unable to delete that post right now." });
    }
  };

  const clearDraft = () => {
    setTitle("");
    setContent("");
    setFeedback({ type: "info", message: "Draft cleared. Ready for a fresh idea." });
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main id="home" className="app-container">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-badge">✨ Welcome back, friend</span>
            <h1>Share your stories with everyone</h1>
            <p>
              Capture ideas, publish them beautifully, and keep your thoughts in one calm workspace.
            </p>
            <div className="hero-stats">
              <div>
                <strong>{posts.length}</strong>
                <span>posts</span>
              </div>
              <div>
                <strong>{posts.filter((post) => post.content && post.content.length > 120).length}</strong>
                <span>deep dives</span>
              </div>
              <div>
                <strong>{posts.length > 0 ? "Live" : "Fresh"}</strong>
                <span>status</span>
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

          {feedback ? <div className={`feedback-banner ${feedback.type}`}>{feedback.message}</div> : null}

          <div className="form-group">
            <div className="input-meta">
              <label htmlFor="title">Title</label>
              <span>{titleCharacterCount}/80</span>
            </div>
            <input
              id="title"
              placeholder="A catchy title..."
              value={title}
              maxLength={80}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="input-meta">
              <label htmlFor="content">Content</label>
              <span>{contentCharacterCount}/500</span>
            </div>
            <textarea
              id="content"
              placeholder="What do you want to share today?"
              value={content}
              maxLength={500}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="publish-btn" onClick={addPost} disabled={isPublishDisabled}>
              {isSubmitting ? "Publishing..." : "Publish post"}
            </button>
            <button className="secondary-btn" type="button" onClick={clearDraft}>
              Clear draft
            </button>
          </div>

          <div className="preview-card">
            <p className="preview-label">Live preview</p>
            <h3>{title.trim() || "Your polished title appears here"}</h3>
            <p>{content.trim() || "Start typing and your preview will update instantly."}</p>
          </div>
        </section>

        <section id="posts" className="posts-section">
          <div className="section-heading posts-heading">
            <div>
              <p className="section-label">Recently published</p>
              <h2>Your posts</h2>
            </div>
            <span className="posts-pill">{filteredPosts.length} shown</span>
          </div>

          <div className="search-bar">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts by title or content"
              aria-label="Search posts"
            />
          </div>

          {isLoadingPosts ? (
            <div className="status-card">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="status-card empty-state">
              <h3>No posts yet</h3>
              <p>Your first post will appear here once you publish it.</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="status-card empty-state">
              <h3>No matching posts</h3>
              <p>Try a different keyword to find what you need.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-card__header">
                  <div>
                    <h3>{post.title}</h3>
                    <p className="post-meta">{formatPostDate(post.created_at)}</p>
                  </div>
                  <span className="post-dot" />
                </div>
                <p>{post.content}</p>
                <div className="post-card__footer">
                  <span className="post-pill post-pill--soft">Published</span>
                  <button className="delete-btn" onClick={() => deletePost(post.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <section className="photo-showcase">
          <div className="section-heading">
            <div>
              <p className="section-label">Inspiration</p>
              <h2>Fresh visuals for your ideas</h2>
            </div>
          </div>

          <div className="photo-grid">
            <img src={readingNook} alt="Reading and writing inspiration" className="showcase-image" />
            <img src={writerSetup} alt="Creative blog workspace" className="showcase-image" />
            <img src={journalCards} alt="Comfortable writing setup" className="showcase-image" />
          </div>
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