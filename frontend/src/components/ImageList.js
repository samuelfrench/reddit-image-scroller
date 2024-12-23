import React, { useEffect, useState, useCallback, useRef } from 'react';
import './ImageList.css';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [after, setAfter] = useState(null);
  const [fetching, setFetching] = useState(false);
  const scrollRef = useRef(null);
  const [batchLoaded, setBatchLoaded] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchImages = useCallback(async () => {
    setFetching(true);
    try {
      const response = await fetch(`${API_URL}/reddit/r/pics.json?after=${after || ''}`);
      const data = await response.json();
      const imageUrls = data.data.children
        .map(child => child.data.url)
        .filter(url => /\.(jpg|jpeg|png|gif)$/.test(url));

      setImages(prevImages => [...prevImages, ...imageUrls]);

      // Delay updating "after" until the current batch is fully scrolled through
      if (imageUrls.length > 0) {
        setBatchLoaded(false); // Mark batch as not fully scrolled
        scrollRef.current = data.data.after; // Store the next "after" temporarily
      } else {
        setAfter(null); // No more data to fetch
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [after, API_URL]);

  const handleScroll = useCallback(() => {
    if (!batchLoaded && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      setAfter(scrollRef.current); // Update "after" when scrolled to the bottom
      setBatchLoaded(true); // Mark the batch as fully scrolled
    }
  }, [batchLoaded]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="image-list">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="images">
        {images.map((url, index) => (
          <div key={index} className="image-container">
            <img src={url} alt={`Image ${index}`} />
          </div>
        ))}
      </div>
      {!fetching && after && (
        <button onClick={fetchImages}>Load More</button>
      )}
    </div>
  );
};

export default ImageList;