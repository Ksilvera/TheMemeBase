import { useEffect, useState } from "react";
import firebase from "./firebase";
import LoadingImage from "./LoadedImage";
import { Button } from "react-bootstrap";
import MemeClient from "./MemeClient";
import { doc, getFirestore } from "firebase/firestore";

const client = new MemeClient();

const MemeListItem = ({user, isFavorite, meme}) => {
    const [img,setImg] = useState(null);
    const firestore = getFirestore();

    useEffect(() => {
        const generateMeme = async () => {
            try{
                const image = await client.generateMeme(meme.data.template, meme.data.text);
                setImg(image);
            }catch(error){
                console.error(error);
            }
        };
        generateMeme();
    },[meme]);

    const deleteMeme = () => {
        const memeRef = doc(firestore, "users", user.email, "memes", meme.id);
        if(isFavorite){
            memeRef.deleteDoc(memeRef);
        }else{
            memeRef.setDoc(meme.data);
        }
    };

    if(img === null)
        return<p>Loading...</p>;

    return(
        <div style={{width:600}}>
            <LoadingImage src = {img} />
            {user && (
                <Button
                    style={{float:"right", marginBottom:10}}
                    variant={isFavorite ? "danger" : "primary"}
                    onClick={deleteMeme}
                >
                    {isFavorite ? "Remove" : "Add"} Favorite
                </Button>
            )}
        </div>
    );
}

export default MemeListItem