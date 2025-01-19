import React, { useState, useEffect } from "react";

function ImageSearch() {
  const [query, setQuery] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);

  // S3 bucket URL for image metadata and images
  const S3_BUCKET_URL = "https://my-image-metadata-bucket.s3.amazonaws.com";

  // Fetch image metadata from S3 bucket
  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        // Fetch metadata from S3 bucket URL
        const response = await fetch(`${S3_BUCKET_URL}/image_metadata.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }
        const data = await response.json();
        setAllImages(data || []); // Default to empty array if data is undefined
        setFilteredImages(data || []); // Default to empty array if data is undefined
      } catch (error) {
        console.error("Error fetching images:", error);
        setAllImages([]);
        setFilteredImages([]);
      }
    };

    fetchAllImages();
  }, []);

  // Filter images based on search query
  const handleSearch = () => {
    if (query.trim() === "") {
      setFilteredImages(allImages); // Show all images if query is empty
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = allImages.filter((image) =>
        image.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredImages(filtered);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Image Search</h1>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter tags (e.g., tree, sky)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <div
              key={image.file_name}
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                overflow: "hidden",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                maxWidth: "300px",
              }}
            >
              <img
                 src={`${S3_BUCKET_URL}/images/${image.file_name}`} // Fetch image from S3 bucket
                //src={`https://my-image-metadata-bucket.s3.amazonaws.com/images/${image.file_name}`}

                alt={image.file_name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                }}
                loading="lazy"
              />

              <div style={{ padding: "10px", textAlign: "center" }}>
                <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>
                  Tags: {image.tags.join(", ")}
                </p>
              </div>
              {/* <div style={{ padding: "10px", textAlign: "center" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                  {image.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        margin: "2px",
                        padding: "5px 5px",
                        backgroundColor: "#D0E8D6", // Turquoise background color
                        color: "#3CB371", // White font color
                        border: "2px solid #3CB371",
                        borderRadius: "20px", // Rounded edges
                        fontSize: "12px",
                        fontWeight: "bold",
                        textTransform: "capitalize", // Capitalizes the first letter of each word
                        display: "inline-block", // Makes the tag appear as a box
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div> */}

            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            No images found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
}

export default ImageSearch;
