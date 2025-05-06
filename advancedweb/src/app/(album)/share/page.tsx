'use client'

import AlbumPreview from '@/component/albumPreview';
import Album from '../view/page';
import styles from './index.module.css'
import Image from 'next/image';
import Button from '@/component/button';
import { useRouter } from 'next/navigation';

export default function Share({params}: {params: {albumId: string}}) {

    // Fetch the images from the server using the albumId
    const { albumId } = params;
    const exampleImagePaths = [ "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg" , "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg"];


    const exampleUsers = [
        {username: "Gaeun", user_id: "alice@example.com" },
        {username: "Emil", user_id: "bob@example.com" },
        {username: "Kim Lööf", user_id: "charlie@example.com" }
      ];

    const router = useRouter();

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.galleryButton}>
                <Button name="Back" size="m" handleButtonClick={() => {router.push("/view")}} />
            </div>
            <div className={styles.gallery}>
            <h1>Album Preview</h1>
                <div className={styles.grid}>
                    {exampleImagePaths.map((src, idx) => (
                        <Image
                        width={100}
                        height={100}
                        key={idx}
                        src={src}
                        alt={`Photo ${idx + 1}`}
                        className={styles.gridImage}/>
                    ))}
                </div>
            </div>
            <div className={styles.browse}>
                <div>
                    <h1>Share your album</h1>
                    <p>Share your album with friends and family!</p>

                    <input
                            type="text"
                           placeholder="Search users..."
                  
                            style={{ marginBottom: 8, padding: 4, width: "100%" }}
                        />
                </div>

                    

                <div className={styles.sharedWith}>
                    <h2>Album shared with</h2>
                    <ul>
                        {exampleUsers.map(user => (
                            <li key={user.user_id}>
                                <strong>{user.username}</strong> <span>({user.user_id})</span>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </div>
    )
}