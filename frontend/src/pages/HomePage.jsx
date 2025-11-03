import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ImageGrid from "../components/ImageGrid";

const HomePage = () => {
  const { user, logout, backendUrl } = useAuth();

  const [term, setTerm] = useState("");
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [topSearches, setTopSearches] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchMeta, setSearchMeta] = useState(null);

  // Fetch top searches
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/top-searches`)
      .then((res) => setTopSearches(res.data))
      .catch((err) => console.error("Error fetching top searches:", err));
  }, [backendUrl]);

  // Fetch user search history
  useEffect(() => {
    if (user) {
      axios
        .get(`${backendUrl}/api/history`, { withCredentials: true })
        .then((res) => setHistory(res.data))
        .catch((err) => console.error("Error fetching history:", err));
    } else {
      setHistory([]);
    }
  }, [user, backendUrl]);

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!term.trim() || !user) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/search`,
        { term },
        { withCredentials: true }
      );
      setImages(res.data);
      setSearchMeta({ term: term, count: res.data.length });
      setSelected([]);

      axios
        .get(`${backendUrl}/api/history`, { withCredentials: true })
        .then((res) => setHistory(res.data));
    } catch (err) {
      console.error("Error during search:", err);
    }
  };


  // Triggered when user clicks on history item
const handleHistorySearch = async (clickedTerm) => {
  setTerm(clickedTerm); // show it in input
  if (!clickedTerm.trim() || !user) return;

  try {
    const res = await axios.post(
      `${backendUrl}/api/search`,
      { term: clickedTerm },
      { withCredentials: true }
    );
    setImages(res.data);
    setSearchMeta({ term: clickedTerm, count: res.data.length });
    setSelected([]);
  } catch (err) {
    console.error("Error during history search:", err);
  }
};


  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>ImageSearch</h1>
        <div style={styles.navAuth}>
          {user ? (
            <>
              <span style={styles.welcomeMsg}>Welcome, {user.name || "User"}</span>
              <button onClick={logout} style={styles.authButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.authButton}>
                Login
              </Link>
              <Link to="/login" style={styles.authButton}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Layout */}
      <div style={styles.layout}>
        {user && (
          <aside style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Your Search History</h3>
            {history.length > 0 ? (
              history.map((h) => (
                <div key={h._id} onClick={() => handleHistorySearch(h.term)} style={styles.historyItem}>
                  <span style={styles.historyTerm}>{h.term}</span>
                  <span style={styles.historyTime}>
                    {new Date(h.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p style={styles.historyEmpty}>No history yet.</p>
            )}
          </aside>
        )}

        {/* Main content */}
        <main style={styles.mainContent}>
          <div style={styles.banner}>
            <span style={{ fontWeight: "bold" }}>🔥 Top Searches:</span>
            {topSearches.map((s) => (
              <span key={s._id} style={styles.tag} onClick={() => handleHistorySearch(s._id)}>
                {s._id}
              </span>
            ))}
          </div>

          {!user ? (
            <div style={styles.loginPrompt}>
              <h2>Welcome to ImageSearch Pro</h2>
              <p>Please log in to search for images and view your history.</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSearch} style={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Search for any images..."
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.button}>
                  Search
                </button>
              </form>

              <div style={styles.resultsArea}>
                <div style={styles.metaHeader}>
                  {searchMeta && (
                    <span style={styles.metaText}>
                      You searched for "{searchMeta.term}" — {searchMeta.count} results.
                    </span>
                  )}
                  {images.length > 0 && (
                    <span style={styles.counter}>
                      Selected: {selected.length} images
                    </span>
                  )}
                </div>

                {images.length > 0 ? (
                  <ImageGrid
                    images={images}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ) : (
                  <div style={styles.gridPlaceholder}>
                    <p>Search for images to see results here.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Inline responsive CSS */}
      <style>
        {`
        @media (max-width: 1024px) {
          .layout {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            order: 2;
          }
          .mainContent {
            order: 1;
          }
        }

        @media (max-width: 768px) {
          nav {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .navAuth {
            align-self: flex-end;
          }
          input {
            font-size: 14px;
          }
          button {
            font-size: 14px;
            padding: 10px 15px;
          }
        }

        @media (max-width: 480px) {
          .layout {
            padding: 10px;
          }
          .sidebar {
            font-size: 14px;
          }
          .banner {
            font-size: 12px;
            padding: 10px;
          }
          .gridPlaceholder {
            padding: 20px;
            font-size: 14px;
          }
        }
        `}
      </style>
    </div>
  );
};

// --- STYLES ---
const styles = {
  page: { fontFamily: "Arial, sans-serif", background: "#f9f9f9", minHeight: "100vh" },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 30px",
    background: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navTitle: { margin: 0, color: "#007bff" },
  navAuth: { display: "flex", gap: "10px", alignItems: "center" },
  welcomeMsg: { marginRight: "15px", color: "#333", fontWeight: "bold" },
  authButton: {
    textDecoration: "none",
    padding: "8px 12px",
    cursor: "pointer",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
  },

  layout: {
    display: "flex",
    padding: "20px 30px",
    gap: "20px",
  },

  sidebar: {
    flex: "0 0 280px",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    maxHeight: "85vh",
    overflowY: "auto",
  },
  sidebarTitle: { marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: "10px" },
  historyItem: {
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "14px",
  },
  historyTerm: { display: "block", fontWeight: "bold", color: "#333" },
  historyTime: { fontSize: "12px", color: "#777" },
  historyEmpty: { color: "#888", fontStyle: "italic" },

  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  banner: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    fontSize: "14px",
  },
  tag: {
    background: "#e0e0e0",
    color: "#333",
    padding: "3px 8px",
    borderRadius: "12px",
    margin: "0 4px",
    fontSize: "13px",
  },
  searchForm: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "12px 15px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "12px 25px",
    cursor: "pointer",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
  loginPrompt: {
    textAlign: "center",
    padding: "40px",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  resultsArea: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  metaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  metaText: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#555",
  },
  counter: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#007bff",
  },
  gridPlaceholder: {
    textAlign: "center",
    padding: "50px",
    color: "#888",
    fontSize: "18px",
  },
};

export default HomePage;
