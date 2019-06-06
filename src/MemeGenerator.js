import React, {Component} from 'react';
import './App.css';
import {Button, ControlLabel, FormControl, FormGroup, Glyphicon} from "react-bootstrap"
import LoadedImage from "./LoadedImage";

import MemeClient from "./MemeClient";
import firebase from "./firebase"

let client = new MemeClient();

export default class MemeGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {selectedTemplate: undefined, availableTemplates: undefined};
        this.handleChangeSelectedTemplate = this.handleChangeSelectedTemplate.bind(this);

    }

    componentDidMount(){
        client.getTemplate().then(templates => {
            this.setState({
                availableTemplates: templates,
                selectedTemplate: Object.keys(templates)[0]
            });
        })
    }
    handleChangeSelectedTemplate(v) {
        this.setState({selectedTemplate: v.target.value});
    }

    render() {
        if (!this.state.availableTemplates)
            return <div>Loading list of available templates.</div>
        return (
            <div>
                <h2>Make a meme!</h2>
                <div>
                    Choose a template:
                    <FormControl componentClass={"select"} value={this.state.selectedTemplate} onChange={this.handleChangeSelectedTemplate}>
                        {
                            Object.keys(this.state.availableTemplates).map(v => {
                                return <option value={v} key={v}>{v}</option>
                            })}
                    </FormControl>
                    <MemeCustomizer templateName={this.state.selectedTemplate}
                                    template={this.state.availableTemplates[this.state.selectedTemplate]}
                                    user = {this.props.user}/>
                </div>
            </div>
        )
    }
}

class MemeCustomizer extends Component {
    constructor(props) {
        super(props);

        this.req = null;
        let tmpText = {}
        for (let textblock of Object.keys(this.props.template.text)) {
            tmpText[textblock] = textblock;
        }
        this.state = {img: undefined, text: tmpText, updateInProgress: false, good: true};
        this.handleChangeInTextField = this.handleChangeInTextField.bind(this);
        this.handleMemeTextChange = this.handleMemeTextChange.bind(this);
        // this.handleMemeTextChange();
        this.saveMeme = this.saveMeme.bind(this);
    }

    componentDidMount() {
        this.handleMemeTextChange();
    }

    componentDidUpdate(prevProps) {
        if (this.props.template != prevProps.template && this.props.templateName) {
            let tmpText = {}
            for (let textblock of Object.keys(this.props.template.text)) {
                tmpText[textblock] = textblock;
            }
            console.log(tmpText);
            this.setState({img: undefined, text: tmpText, savedMeme:null});
            this.setState({updateInProgress: true});
            this.req =
                client.generateMeme(
                    this.props.templateName,
                    tmpText
                );
            this.req.then(img => {
                this.setState({img: img, updateInProgress: false})
            }).catch(e => console.log(e));
        }
    }

    handleMemeTextChange(ev) {
        if (ev) {
            ev.preventDefault();
            this.setState({
                updateInProgress: true,
                savedMeme: {templateName: this.props.templateName, text: this.state.text}
            });
        }
        else
            this.setState({updateInProgress: true, savedMeme: null});
        this.req =
            client.generateMeme(
                this.props.templateName,
                this.state.text
            );
        firebase.firestore.collection("memes").add({
            timestamp: Date.now(),
            template: this.props.templateName,
            text: this.state.text
        }).then((e) =>{
            this.setState({savedKey: e.id});
        });

        this.req.then(img => {
            this.setState({img: img, updateInProgress: false, isSaved:false})
        }).catch(e => console.log(e));
    }

    handleChangeInTextField(v) {
        let block = v.target.attributes["data-textblock"].value;
        let newText = this.state.text;
        newText[block] = v.target.value;
        this.setState(
            {text: newText}
        )

    }

    saveMeme(e){
        this.setState({good: false});
        var t = this.state.savedMeme;
        var x = this.props.user.email;
        this.setState({savedMeme: null});
        firebase.firestore.collection('users').doc(this.props.user.email).collection("memes").doc(this.state.savedKey).set({
            memeName: t.templateName,
            memeText: t.text,
            timeStamp: Date.now()
        }).then(e=>{
            this.setState({
                updateInProgress: false,
                isSaved: true
            });
        })
    }

    render() {
        if (!this.props.template.text)
            return <p>Loading, there's no text on this?</p>
        return <div>

            Customize the text: <form onSubmit={this.handleMemeTextChange}>

            <FormGroup>
                {Object.keys(this.props.template.text).map(t => {
                    let txt = this.state.text[t];
                    return <span key={t}><ControlLabel>{t}</ControlLabel> <FormControl type="text"
                                                                                       value={txt}
                                                                                       disabled={this.state.updateInProgress}
                                                                                       onChange={this.handleChangeInTextField}
                                                                                       data-textblock={t}/></span>
                })}
                <Button type={"submit"} disabled={this.state.updateInProgress}>Regenerate</Button>
            </FormGroup>
        </form>
            <div style = {{width: 600}}>
            <LoadedImage src={this.state.img}/>
                <Button style = {{float: "right"}} bsStyle = {this.state.isSaved ? "success" : "primary"} disabled={this.state.updateInProgress || !this.state.savedMeme || !this.state.savedKey} onClick = {this.saveMeme}>
                    Save Meme
                </Button>
            </div>
        </div>
    }
}



