import axios from "axios";

class MemeClient {

    constructor() {
        //this.endpoint = "http://central.thememebase.com:8080/";
        this.endpoint = "https://apimeme.com/";
        this.cache={};
    }

    async getTemplate() {
        const response = await axios.get(`${this.endpoint}templates`);
        return response.data;
    }

    async generateMeme(templateName, textBlock) {

        let req = {
            memeTemplate: templateName,
            text: textBlock
        };
        let idx = JSON.stringify(req);
        
        if(this.cache[idx]){
            return Promise.resolve(this.cache[idx]);
        }

        const response = await axios.post(`${this.endpoint}memes`, req,{
            responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        this.cache[idx] = blob;

        return blob;
    }
}

export default MemeClient



