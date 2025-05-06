'use client';
import Button from "@/component/button";
import Gallery from "@/component/gallery";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";


export default function Album({params}: {params: {albumId: string}}) {

    // Fetch the images from the server using the albumId
    const { albumId } = params;

    const exampleImagePaths = [ "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg", "/MyPhoto.jpg" ];
    const router = useRouter();


    return (
        <div className={styles.pageWrapper}>
            <div className={styles.galleryButtons}>
                <Button name="Back" size="m" handleButtonClick={() => {router.push("/map")}} />
                <button onClick={() => {router.push("/share")}} className={styles.button}>
                    <img src="/icons8-share-photo-53 (1).png" alt="Back" />
                </button>
            </div>
            <Gallery imagePaths={exampleImagePaths} />
        </div>
    )
};