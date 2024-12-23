// filepath: /home/sam/reddit-image-scroller/frontend/src/components/ImageList.js
import React, { useEffect, useState, useCallback } from 'react';
import './ImageList.css';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [after, setAfter] = useState(null);
  const [fetching, setFetching] = useState(false);

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
      setAfter(data.data.after);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [after, API_URL]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="image-list">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="images">
        {images.map((url, index) => (
          <img key={index} src={url} alt={`Image ${index}`} />
        ))}
      </div>
      {!fetching && after && (
        <button onClick={fetchImages}>Load More</button>
      )}
    </div>
  );
};

export default ImageList;