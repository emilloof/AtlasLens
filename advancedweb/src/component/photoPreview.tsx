'use client'
import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'

export default function PhotoPreview({ imageSrc, isSelected, width, height , setSelectedPhotos}: { imageSrc: string , isSelected: boolean, width:number, height: number, setSelectedPhotos : Dispatch<SetStateAction<string[]>>} ) {


    const handleChange = () => {
        setSelectedPhotos(prev =>
          isSelected
            ? prev.filter(src => src !== imageSrc) // remove if already selected
            : [...prev, imageSrc] // add if not selected
        );
      };

    return(
    <div style={{width: width , height: height, position: "relative"}}>
        <Image src={imageSrc} fill alt={"failed to load"} objectFit='cover'/>
        <input type="checkbox" checked={isSelected} onChange={handleChange} style={{ position: "relative"}}/>
    </div>)
}