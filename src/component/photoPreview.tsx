'use client'
import OptimizedImage from './OptimizedImage'
import { Dispatch, SetStateAction } from 'react'

export default function PhotoPreview({ imageSrc, imageID, isSelected, width, height , setSelectedPhotos}: { imageSrc: string , imageID: string, isSelected: boolean, width:number, height: number, setSelectedPhotos : Dispatch<SetStateAction<string[]>>} ) {


    const handleChange = () => {
        setSelectedPhotos(prev =>
          isSelected
            ? prev.filter(src => src !== imageID) // remove if already selected
            : [...prev, imageID] // add if not selected
        );
      };

    return(
    <div style={{width: width , height: height, position: "relative"}}>
        <OptimizedImage src={imageSrc} image_id={imageID} fill style={{ objectFit: 'cover' }} />
        <input type="checkbox" checked={isSelected} onChange={handleChange} style={{ position: "relative"}}/>
    </div>)
}