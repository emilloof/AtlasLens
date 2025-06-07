'use client'

import AlbumPreview from '@/component/albumPreview';
import styles from './index.module.css'
import { useState } from 'react';
import Button from '@/component/button';
import { useRouter } from 'next/navigation';
import PhotoPreview from '@/component/photoPreview';
import useHandleShare from '@/hooks/useHandleShare';
import React from 'react';

export default function Share({params}: {params: Promise<{albumId: string}>}) {

    // Fetch the images from the server using the albumId
    const { albumId } = React.use(params);   
    const { search, setSearch, suggestions, selectedPhotos, setSelectedPhotos, sharedUsers, fetchAlbum, images, fetchImages } = useHandleShare(albumId);
    const router = useRouter();    
    // call on this function when the user clicks the "Add" button
    // like this: handleAddUser(user.id)
    const handleAddUser = async (userId: string) => {
        try {
            const res = await fetch('/api/add_user_to_album', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                album_id: albumId,
            }),
            });
            if (!res.ok) {
            const data = await res.json();
            alert(data.message || "Failed to add user");
            return;
            }
            alert("User added!");
            fetchAlbum(); // Update shown shared users after adding a new user
        } catch (err) {
            alert("Error adding user");
        }
        };

    const handleRemovePhotos = async () => {        
        try {
            const res = await fetch('/api/remove_image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageIds: selectedPhotos, //SEND ID NOT URL
                    albumId: albumId,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                alert(data.message || "Failed to remove photos");
                return;
            }
            alert("Photos removed!");
            setSelectedPhotos([]); // Clear selected photos after removal
            fetchImages(); // Update the album view
        }   catch (err) {
            alert("Error removing photos");
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.galleryButton}>
                <Button name="Back" size="m" handleButtonClick={() => {router.push("/view/" + albumId)}} />
            </div>
            <div className={styles.gallery}>
            <h1>Album Preview</h1>  
                <div className={styles.grid}>
                    {images.map((img, idx) => (
                        <PhotoPreview key={idx} imageSrc={img.url} imageID={img.image_id} isSelected={selectedPhotos.includes(img.image_id)} width={80} height={80} setSelectedPhotos={setSelectedPhotos} />
                    ))}
                </div>
            </div>

            {selectedPhotos.length > 0 && (
                <div style={{paddingTop: 200}}>
                    <Button
                        name="Remove selected photos"
                        size="l"
                        handleButtonClick={() => {handleRemovePhotos()}}
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
                            <a>Email: {user.email}</a>
                            <a>Username: {user.username}</a>
                            
                            </div>
                        <Button name="Add" size="s" handleButtonClick={() => {handleAddUser(user.id)}} />
                    </div>
                        ))}
                      </div>
                    )}
                                                        

                <div className={styles.sharedWith}>
                    <h2>Album shared with</h2>
                    <ul>
                        {sharedUsers.map(user => (
                            <li key={user.id}>
                                <strong>{user.username}</strong> <span>({user.email})</span>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </div>
    )
}