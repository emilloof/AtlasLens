'use client'
import Button from "@/component/button";
import Input from "@/component/input";
import styles from "./index.module.css";
import useHandleSearchCity from "@/hooks/useHandleSearchCity";
import UploadPhotos from "@/component/upload";

export default function Create() {

    const {city, setCity, handleSearch, responseText, loading} = useHandleSearchCity();

    return (
        <div className={styles.pageWrapper}>
            <section className={styles.inputWrapper}>

                <UploadPhotos onUpload={(files) => {/*Handle uploaded pictures */}} />
            <form className={styles.formWrapper} onSubmit={handleSearch}>
                <Input
                    size="l"    
                    label="city"
                    placeholder="Please enter a city"
                    type="text"
                    value={city}
                    onChange={(e) => {setCity(e.target.value)}}
                    errorMessage={""}
                />
                </form>
                <Button name={loading ? "Loading... " : "Search"} size="l" handleButtonClick={handleSearch} />
            
                {responseText && (
                <section className={styles.responseWrapper}>
                    <p>{responseText}</p>
                </section>
            )}
            </section>
            
            
            </div>
    )
    
}