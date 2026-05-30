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
  canOpenAlbum?: boolean;
}

const AlbumPreview: React.FC<AlbumPreviewProps> = ({
  images,
  width = 150,
  height = 100,
  interact = false,
  albumID,
  canOpenAlbum = true,
}) => {
  images = images.slice(0, 5);
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);

  const handleClick = () => {
    if (!interact || !albumID || showLoginPrompt) {
      return;
    }

    if (!canOpenAlbum) {
      setShowLoginPrompt(true);
      return;
    }

    router.push("/view/" + albumID);
  };

  return (
    <div className={`${styles.stack} ${interact ? styles.interact : ''} ${showLoginPrompt ? styles.loginRequired : ''}`} style={{ width, height }} onClick={handleClick}>
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
      {showLoginPrompt && (
        <div
          className={styles.loginPrompt}
          onClick={() => {
            router.push("/login");
          }}
        >
          <p>Log in to view</p>
        </div>
      )}
    </div>
  );
};

export default AlbumPreview;
