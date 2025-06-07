'use client'

import AlbumPreview from '@/component/albumPreview';
import Album from '../view/page';
import styles from './index.module.css'
import Image from 'next/image';
import Button from '@/component/button';
import { useRouter } from 'next/navigation';
import PhotoPreview from '@/component/photoPreview';
import useHandleShare from '@/hooks/useHandleShare';

export default function Share({params}: {params: {albumId: string}}) {

    // Fetch the images from the server using the albumId
    const { albumId } = params;
    const exampleImagePaths = [ "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg" , "/MyPhoto - kopia.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg"];
    const exampleUsers = [
        {username: "Gaeun", id: "alice@example.com" },
        {username: "Emil", id: "bob@example.com" },
        {username: "Kim Lööf", id: "charlie@example.com" }
      ];    
    const { search, setSearch, suggestions, selectedPhotos, setSelectedPhotos } = useHandleShare();
    const router = useRouter();

    const fetchAlbum = async () => {
        try {
            const res = await fetch(`/api/get_album?album_id=${albumId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch album");
            }
            const data = await res.json();
            // Process the album data as needed
            console.log(data);
        } catch (error) {
            console.error("Error fetching album:", error);
        }
    }

    // call on this function when the user clicks the "Add" button
    // like this: handleAddUser(user.id)
    const handleAddUser = async (userId: string) => {
        try {
            const res = await fetch('/api/add_user_to_album', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                album_id: albumId, // from your params
            }),
            });
            if (!res.ok) {
            const data = await res.json();
            alert(data.message || "Failed to add user");
            return;
            }
            // Optionally update your shared users list here
            // e.g., fetch again or update state
            alert("User added!");
        } catch (err) {
            alert("Error adding user");
        }
        };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.galleryButton}>
                <Button name="Back" size="m" handleButtonClick={() => {router.push("/view")}} />
            </div>
            <div className={styles.gallery}>
            <h1>Album Preview</h1>  
                <div className={styles.grid}>
                    {exampleImagePaths.map((src, idx) => (
                        <PhotoPreview key={idx} imageSrc={src} isSelected={selectedPhotos.includes(src)} width={80} height={80} setSelectedPhotos={setSelectedPhotos} />
                    ))}
                </div>
            </div>

            {selectedPhotos.length > 0 && (
                <div style={{paddingTop: 200}}>
                    <Button
                        name="Remove selected photos"
                        size="l"
                        handleButtonClick={() => {/* your remove logic here */}}
                        />
                </div>
            )}

            <div className={styles.browse}>
                <div>
                    <h1>Share your album</h1>
                    <p>Share your album with friends and family!</p>
                    <input
                        type="text"
                        placeholder="Search users..."
                        style={{ marginBottom: 8, padding: 4, width: "100%" }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        />
                </div>

                    {suggestions && (
                    <div style={{gap: "8px", display: "flex", flexDirection: "column"}}>
                        {suggestions.map(user => (
                            <div className={styles.suggestionBox} key={user.id}>
                            <div style={{ display: "flex", flexDirection: "column", paddingRight: 8 }}key={user.id}>
                            <a>Email: {user.id}</a>
                            <a>Username: {user.username}</a>
                            
                            </div>
                        <Button name="Add" size="s" handleButtonClick={() => {/*Add logic here */}} />
                    </div>
                        ))}
                      </div>
                    )}
                                                        

                <div className={styles.sharedWith}>
                    <h2>Album shared with</h2>
                    <ul>
                        {exampleUsers.map(user => (
                            <li key={user.id}>
                                <strong>{user.username}</strong> <span>({user.id})</span>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </div>
    )
}