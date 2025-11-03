import React from "react";

const ImageGrid = ({ images, selected, setSelected }) => {
  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleShare = async () => {
    if (selected.length === 0) {
      alert("Please select at least one image to share!");
      return;
    }

    // Get URLs of selected images
    const selectedImages = images
      .filter((img) => selected.includes(img.id))
      .map((img) => img.links.html || img.urls.full);

    const shareText = `Check out these amazing images I found on ImageSearch!\n\n${selectedImages.join(
      "\n"
    )}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "ImageSearch Results",
          text: "Here are some cool photos I found!",
          url: selectedImages[0], // share the first one for preview
        });
      } else {
        // Fallback: copy all links to clipboard
        await navigator.clipboard.writeText(shareText);
        alert("Links copied to clipboard! You can paste and share them anywhere.");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div>
      {/* Share Button (Only visible if any image is selected) */}
      {selected.length > 0 && (
        <div style={styles.shareBar}>
          <span>{selected.length} selected</span>
          <button onClick={handleShare} style={styles.shareButton}>
            🔗 Share Selected
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {images.map((img) => {
          const isSelected = selected.includes(img.id);
          return (
            <div
              key={img.id}
              style={{
                ...styles.card,
                border: isSelected ? "3px solid #007bff" : "1px solid #ddd",
                transform: isSelected ? "scale(1.03)" : "scale(1)",
                boxShadow: isSelected
                  ? "0 4px 10px rgba(0,123,255,0.3)"
                  : "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onClick={() => toggleSelect(img.id)}
            >
              <img
                src={img.urls.small}
                alt={img.alt_description || "Unsplash image"}
                style={styles.image}
              />
              {isSelected && <div style={styles.overlay}>✓ Selected</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
    marginTop: "20px",
  },
  card: {
    position: "relative",
    cursor: "pointer",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "all 0.2s ease",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px",
    transition: "transform 0.3s ease",
  },
  overlay: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    background: "rgba(0,123,255,0.7)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  shareBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#007bff",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  shareButton: {
    background: "white",
    color: "#007bff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default ImageGrid;
