import React, { useEffect, useState} from 'react';

import './App.css';
import MemeGenerator from "./components/MemeGenerator"
import {HashRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import Login from "./components/Login"
import {auth} from "./components/firebase"
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap"
import MemeList from "./components/MemeList"
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App(){
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const unsubsribe = onAuthStateChanged(auth, user => {
            setUser(user);
        }, error => {
            console.error(error);
        });

        return () => unsubsribe();
    }, []);

    let nav;
    if(user){
        nav = (
            <Nav>
                <LinkContainer to="/generate">
                    <Nav.Item>Generate Memes</Nav.Item>
                </LinkContainer>
                <LinkContainer to="/saved">
                    <Nav.Item>View Saved Memes</Nav.Item>
                </LinkContainer>
                <LinkContainer>
                    <Nav.Item onClick={()=>auth.signOut()}>Logout</Nav.Item>
                </LinkContainer>
            </Nav>
        );
    }else{
        nav = (
            <Nav>
                <LinkContainer to="/login">
                    <Nav.Item>Register/Sign-in to generate memes</Nav.Item>
                </LinkContainer>
            </Nav>
        );
    }

    if(user === undefined)
        return <span>Loading</span>;

    return(
        <HashRouter>
            <div className='App'>
                <Navbar>
                    <Navbar.Brand>
                        <LinkContainer to="/">
                            <span>(the)Memebase v4</span>
                        </LinkContainer>
                    </Navbar.Brand>
                    {nav}
                </Navbar>
                <div className='content'>
                    <div className='container'>
                        <Routes>
                            <Route path = "/" element={<MemeList isUnfiltered={true} user={user} />}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/logout" element={<Logout/>}/>
                            <Route path="/saved" element={<PrivateRoute component={MemeList} user={user} /> }/>
                            <Route path="/generate" element={<PrivateRoute component={MemeGenerator} user={user}/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </HashRouter>
    );
};

const Logout = () =>{
    useEffect(() => {
        auth.signOut();
    },[]);
    return <Navigate to="/"/>
};

const PrivateRoute = ({component: Component, user}) => {
    return user ? <Component/> : <Navigate to='/login'/>;
};

export default App;
