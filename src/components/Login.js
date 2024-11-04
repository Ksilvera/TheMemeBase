import React, {useState} from "react";
import {Alert, Button, FormLabel, FormControl, Form} from "react-bootstrap";
import { auth} from "./firebase";
import { Navigate} from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [redirectToHome, setRedirectToHome] = useState(false);

    const handleSignin = async (e) => {
        e.preventDefault();

        try{
            await signInWithEmailAndPassword(auth, email, password);
            setRedirectToHome(true);
        } catch(error){
            if(error.code === 'auth/user-not-found'){
                try{
                    await createUserWithEmailAndPassword(auth, email, password);
                    setMessage(<span><Alert variant="success">Success: new user registered</Alert></span>);
                    setRedirectToHome(true);
                }catch(error){
                    setMessage(<Alert variant="danger">Error: {error.message}</Alert>);
                }
            }else{
                setMessage(<Alert variant="danger">Error: {error.message}</Alert>);
            }
        }
    };

    const handleUserInput = (e) => {
        const {name, value} = e.target;
        if(name === 'email'){
            setEmail(value);
        }else if(name === 'password'){
            setPassword(value);
        }
    };

    if(redirectToHome){
        return <Navigate path="/" />;
    }

    return(
        <form onSubmit={handleSignin}>
            <FormLabel>Email Address:</FormLabel>
            <FormControl
                type="text"
                name="email"
                vaule={email}
                onChange={handleUserInput}
            />
            <FormLabel>Password:</FormLabel>
            <FormControl
                type="text"
                name="password"
                value={password}
                onChange={handleUserInput}
            />
            {message}
            <Button type="submit" className="btn btn-default">
                Login (or Register)
            </Button>
        </form>
    );
}

export default Login