import React, {useEffect,useState} from 'react';
import '../App.css';
import {Button, FormLabel, FormControl, FormGroup} from "react-bootstrap"
import MemeClient from "./MemeClient";
import MemeCustomizer from"./MemeCustomizer";

const client = new MemeClient();

const MemeGenerator = ({user}) =>{
    const [selectedTemplate, setSelectedTemplate] = useState(undefined);
    const [availableTemplates, setAvailableTemplates] = useState(undefined);

    useEffect(() => {
        const fetchTemplates = async () => {
            const templates = await client.getTemplate();
            setAvailableTemplates(templates);
            setSelectedTemplate(Object.keys(templates)[0]);
        };
        fetchTemplates();
    },[]);

    const handleChangeSelectedTemplate = (e) => {
        setSelectedTemplate(e.target.value);
    }

    if(!availableTemplates){
        return <div>Loading list of available templates.</div>;
    }

    return(
        <div>
            <h2>Make a meme!</h2>
            <div>
                Choose a template:
                <FormControl
                    as="select"
                    value={selectedTemplate}
                    onChange={handleChangeSelectedTemplate}
                >
                    {Object.keys(availableTemplates).map(v => (
                        <option value={v} key={v}>{v}</option>
                    ))}
                </FormControl>
                <MemeCustomizer
                    templateName={selectedTemplate}
                    template={availableTemplates[selectedTemplate]}
                    user={user}
                />
            </div>
        </div>
    );
}



export default MemeGenerator;