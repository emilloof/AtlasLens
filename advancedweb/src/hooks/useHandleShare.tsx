'use client'
import { useState, useEffect, useCallback } from 'react';

export default function useHandleShare(albumId: string) {
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);


    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<{username: string, id: string, email: string}[]>([]);
    const [sharedUsers, setSharedUsers] = useState<{username: string, id: string, email: string}[]>([]);
    
    
    useEffect(() => {
        if (!search) {
            setSuggestions([]);
            return;
        }
        const controller = new AbortController();
        const fetchSuggestions = async () => {
            try {
                const res = await fetch('/api/browse_user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ keyword: search }),
                });
                if (!res.ok) {
                    setSuggestions([]);
                    return;
                }
                const data = await res.json();
                setSuggestions(data.users.map((u: any) => ({
                    username: u.username,
                    email: u.email,
                    id: u.user_id
                })));
            } catch (err) {
                setSuggestions([]);
            }
        };
        fetchSuggestions();
        return () => controller.abort();
    }, [search]);



    const fetchAlbum = useCallback(async () => {
        try {
            const res = await fetch(`/api/album?albumId=${albumId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch album");
            }
            const album = await res.json();
            setSharedUsers(
                album.data.users.map((ua: any) => ({
                    username: ua.user.username,
                    email: ua.user.email,
                    id: ua.user.user_id,
                }))
            );
        } catch (error) {
            setSharedUsers([]);
        }
    }, [albumId]);

    useEffect(() => {
        fetchAlbum();
    }, [fetchAlbum]);

        const [images, setImages] = useState<{ image_id: string, url: string }[]>([]);

        const fetchImages = async () => {
        try {
            const res = await fetch(`/api/album?albumId=${albumId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch album");
            }
            const album = await res.json();
            setImages(album.data.images);
            console.log("Fetched images:", album.data.images);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };
    useEffect(() => {
        fetchImages();
    }, []);
    
    return {
        search,
        setSearch,
        suggestions,
        selectedPhotos, 
        setSelectedPhotos,
        sharedUsers,
        fetchAlbum,
        images, // Expose images to the component
    }
}