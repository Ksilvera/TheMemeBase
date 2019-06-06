import React, {Component} from "react";
import {Button, Panel} from "react-bootstrap";
import firebase from "./firebase"
import Pagination from "react-js-pagination";
import LoadedImage from "./LoadedImage";
import MemeClient from "./MemeClient";

let client = new MemeClient();

export default class MemeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memes: [],
            activePage: 1,
            favorites:{}
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    componentWillMount() {
        const memes = [];
        const array2 = [];
        var docs = this.props.isUnfiltered ? firebase.firestore.collection("memes") : firebase.firestore.collection("users").doc(this.props.user.email).collection("memes");
        if (this.props.user){
            var n = firebase.firestore.collection("users").doc(this.props.user.email).collection("memes");
        this.unregisterCollection2Observer = n.orderBy("timestamp", "desc").onSnapshot(docSnapshot => {
            var n = {};
            docSnapshot.forEach(val => {
                n[val.id] = 1

                //this.handleImg(memes);
            });
            this.setState({favorites: n});
        });
         }
        this.unregisterCollectionObserver = docs.orderBy("timestamp","desc").onSnapshot(docSnapShot=>{
            var n = [];
            docSnapShot.forEach(e =>{
                n.push({
                    id: e.id,
                    data: e.data()
                })
            });
            this.setState({memes: n});
        })
    }

    componentWillUnMount(){
        this.unregisterCollection2Observer();
        this.unregisterCollection2Observer && this.unregisterCollection2Observer();
    }
    handlePageChange(pageNumber){
        this.setState({activePage: pageNumber});
    }

    render() {
        const{currentPage,itemsCount} = this.state;

        const indexOfLastItem = currentPage * itemsCount;
        const indexOfFirstItem = indexOfLastItem - itemsCount;
        const currentItem = this.state.memes.slice(indexOfFirstItem, indexOfLastItem);
        for(var e = [], t = 10 * (this.state.activePage - 1); t < 10 * this.state.activePage && t < this.state.memes.length; t++){
            e.push(<MemeList2 key = {this.state.memes[t].id}  user = {this.props.user} isFavorite = {this.state.favorites[this.state.memes[t].id]} meme = {this.state.memes[t]}/>);
        }
       return (<div>
           <Pagination
               activePage = {this.state.activePage}
               itemsCountPerPage = {10}
               totalItemsCount= {this.state.memes.length}
               pageRangeDisplayed={5}
               onChange={this.handlePageChange}
               />
           {e}

           <Pagination
               activePage = {this.state.activePage}
               itemsCountPerPage = {10}
               totalItemsCount={this.state.memes.length}
               pageRangeDisplayed={5}
               onChange={this.handlePageChange}
           />
       </div>)
    }
}
class MemeList2 extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount(){
        client.generateMeme(this.props.meme.data.template, this.props.meme.data.text).then(n=>{
            this.setState({img: n});
        }).catch(err=>{
            return console.log(err);
        })
    }
    componentWillUnMount(){
        this.dead = true;
    }
    deleteMeme(meme, isFavorite){
        isFavorite ? firebase.firestore.collection("users").doc(this.props.user.email).collection("memes").doc(meme.id).delete()
            : firebase.firestore.collection("users").doc(this.props.user.email).collection("memes").doc(meme.id).set(this.props.meme.data)
    }
    render(){
        if(this.state.img === null)
            return(<p>Loading...</p>);
        if(this.props.user) {
            return (
                <div style={{width: 600}}>
                    <LoadedImage src={this.state.img}/>
                    <Button style={{float: "right", marginBottom: 10}}
                            bsStyle={this.props.isFavorite ? "danger" : "primary"}
                            onClick={this.deleteMeme.bind(this, this.props.meme, this.props.isFavorite)}>
                        {this.props.isFavorite ? "Remove" : "Add"} Favorite
                    </Button>
                </div>
            )
        }
        else{
            return(
                <LoadedImage src = {this.state.img}/>
            )

        }
    }
}
