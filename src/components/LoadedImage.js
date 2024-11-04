import React from "react";

const LoadedImage = ({src})=>{
    if(src){
        return <img alt="meme!" src={URL.createObjectURL(src)}/>;
    }
    return <p>Loading image</p>;
};

export default LoadedImage;