import React, { useEffect, useState } from 'react';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://www.reddit.com/r/pics.json');
        const data = await response.json();
        const imageUrls = data.data.children
          .map(child => child.data.url)
          .filter(url => /\.(jpg|jpeg|png|gif)$/.test(url));
        setImages(imageUrls);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="image-list">
      {images.map((url, index) => (
        <img key={index} src={url} alt={`Reddit image ${index}`} />
      ))}
    </div>
  );
};

export default ImageList;