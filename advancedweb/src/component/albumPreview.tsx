import React from 'react';
import styles from './albumPreview.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AlbumPreviewProps {
  images: string[];
  width?: number;
  height?: number;
  interact?: boolean;
  albumID: string | null;
}

const AlbumPreview: React.FC<AlbumPreviewProps> = ({ images, width = 150, height = 100, interact = false, albumID }) => {
  images = images.slice(0, 5);
  const router = useRouter();

  return (
    <div className={`${styles.stack} ${interact ? styles.interact : ''}`} style={{ width, height }} onClick={() => {router.push("/view/" + albumID)}}>
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Photo ${index + 1}`}
          className={styles.photo}
          width={width}
           height={height}
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
