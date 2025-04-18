import React from 'react';
import styles from './albumPreview.module.css';

interface PhotoStackProps {
  images: string[];
  width?: number;
  height?: number;
}

const AlbumPreview: React.FC<PhotoStackProps> = ({ images, width = 150, height = 100 }) => {
  images = images.slice(0, 5);
  return (
    <div className={styles.stack} style={{ width, height }} onClick={() => {/*Handle album click*/}}>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Photo ${index + 1}`}
          className={styles.photo}
          style={{
            zIndex: images.length - index,
            top: index * 5,
            left: index * 5,
            transform: `rotate(${(index - 2) * 2}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default AlbumPreview;
