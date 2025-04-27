'use client';
import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import './gallery.module.css'
import Image from "next/image";

interface GalleryProps {
    imagePaths: string[];
}


const Gallery: React.FC<GalleryProps> = ({ imagePaths }) => {
    const images = imagePaths.map(path => ({
      original: path,   
      thumbnail: path,
      sizes: "height: 100px",
    }));

    const customRenderItem = (item: any) => {
        return (
            <div style={{height: "70vh", width: "30vw"}}>
            <Image
            src={item.original}
            alt=""
            fill={true}
            style={{
                objectFit: "contain",
            }}
            /></div>)}

  
    return <ImageGallery items={images} renderItem={customRenderItem}/>
};
  
export default Gallery;