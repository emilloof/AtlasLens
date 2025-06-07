'use client'
import { useState, useEffect } from 'react';

export default function useHandleShare() {
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);


    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<{username: string, id: string}[]>([]);

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
                    id: u.email
                })));
            } catch (err) {
                setSuggestions([]);
            }
        };
        fetchSuggestions();
        return () => controller.abort();
    }, [search]);

    return {
        search,
        setSearch,
        suggestions,
        selectedPhotos, 
        setSelectedPhotos
    }
}