import React, {Component} from "react";
import {Alert, Button, ControlLabel, FormControl} from "react-bootstrap";
import firebase from "./firebase"
import {Redirect} from "react-router-dom";

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {Email: '', Password: '', Error: null, show: false};
        this.handleSignin = this.handleSignin.bind(this);
        this.handleUserInput = this.handleUserInput.bind(this);
    }

    handleSignin(e){
        e.preventDefault();
        var n = e.target.Email.value;
        var r = e.target.Password.value;
        firebase.auth.signInWithEmailAndPassword(n,r).then((user)=>{
            this.setState({message: <Redirect to = "/"/>});
        }) .catch((error)=> {
                var errorCode = error.code;
                if(errorCode === 'auth/user-not-found'){
                    firebase.auth.createUserWithEmailAndPassword(this.state.Email,this.state.Password).then((user)=>{
                        this.setState({
                            message: <span> <Alert bsStyle= "success">Success: new user registered</Alert><Redirect to="/"/></span>

                            });
                    })
                        .catch((error) => {
                            this.setState({message:<Alert bsStyle="danger"> Error: {error.message}</Alert>});
                        });
                }
                else
                    this.setState({message:<Alert bsStyle="danger"> Error: {error.message}</Alert>});
                })
    }

    handleUserInput(e){
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    }

    render() {
        const {Email,Password,Error,show} = this.state;

            return (
                <form onSubmit={this.handleSignin}>
                <ControlLabel>
                    Email address:
                </ControlLabel>
                    <FormControl
                        type="text"
                        name="Email"
                        //onChange={this.handleUserInput}

                    />
                    <ControlLabel>
                    Password:
                    </ControlLabel>
                    <FormControl
                        type="password"
                        name="Password"
                        ///onChange={this.handleUserInput}
                    />

                    {this.state.message}
                    <Button type="submit" disabled={false} className="btn btn-default" >
                        Log in (or register)
                    </Button>

                </form>


            )


    }
}