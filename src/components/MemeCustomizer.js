import React, {useEffect,useState} from 'react';
import '../App.css';
import {Button, FormLabel, FormControl, FormGroup} from "react-bootstrap"
import LoadedImage from "./LoadedImage";
import firebase from "./firebase"
import MemeClient from './MemeClient';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';

const client = new MemeClient();

const MemeCustomizer = ({templateName, template, user}) => {
    const [img, setImg] = useState(undefined);
    const [text, setText] = useState({});
    const [updateInProgress, setUpdateInProgress] = useState(false);
    const [savedKey, setSavedKey] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if(template){
            const initialText = Object.keys(template.text).reduce((acc,textblock) => {
                acc[textblock] = textblock;
                return acc;
            },{});

            setText(initialText);
            setUpdateInProgress(true);

            const generateMeme = async () => {
                try{
                    const image = await client.generateMeme(templateName, initialText);
                    setImg(image);
                }catch(error){
                    console.error(error);
                }finally{
                    setUpdateInProgress(false);
                }
            };
            generateMeme();
        }
    }, [template,templateName]);

    const handleMemeTextChange = async (ev) => {
        if(ev){
            ev.preventDefault();
        }

        setUpdateInProgress(true);
        const memeDate = {templateName, text};

        try{
            const image = await client.generateMeme(templateName, text);
            setImg(image);

            const memeDoc = await addDoc(collection(getFirestore(), "memes"), {
                timestamp: Date.now(),
                template: templateName,
                text,
            });
            
            setSavedKey(memeDoc.id);
        }catch(error){
            console.error(error);
        }finally{
            setUpdateInProgress(false);
        }
    };

    const handleChangeInTextField = (e) =>{
        const block = e.target.dataset.textblock;
        const newText = {...text, [block]: e.target.value};
        setText(newText);
    };

    const saveMeme = async () => {
        setIsSaved(false);
        const memeData = {templateName, text};

        try{
            await setDoc(doc(getFirestore(), "users", user.email, "memes", savedKey), {
                memeName: templateName,
                memeText: text,
                timestamp: Date.now(),
            });            
            setIsSaved(true);
        }catch(error){
            console.error(error);
        }
    };

    if(!template.text){
        return <p>Loading, There is no text on this??</p>;
    }

    return(
        <div>
            Customize the text:
            <form onSubmit={handleMemeTextChange}>
                <FormGroup>
                    {Object.keys(template.text).map(t =>(
                        <span key={t}>
                            <FormLabel>{t}</FormLabel>
                            <FormControl
                                type="text"
                                value={text[t]}
                                disabled={updateInProgress}
                                onChange={handleChangeInTextField}
                                data-textblock={t}
                            />
                        </span>
                    ))}
                    <Button type='submit' disabled={updateInProgress}>Regenerate</Button>
                </FormGroup>
            </form>
            <div style={{width: 600}}>
                <LoadedImage src={img}/>
                <Button
                    style={{float:"right"}}
                    variant={isSaved ? "success" : "primary"}
                    disabled = {updateInProgress || !savedKey}
                    onClick={saveMeme}
                >
                    Save Meme
                </Button>
            </div>
        </div>
    );
};

export default MemeCustomizer