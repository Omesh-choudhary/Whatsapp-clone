

const fileFormat=(url)=>{
   
    const fileExt=url.split(".").pop()
    if(fileExt=="mp4" || fileExt=="webm" || fileExt=="ogg"){
        return "video"
    }

    if(fileExt=="wav" || fileExt=="mp3"){
        return "audio"
    }

    if(fileExt=="png" || fileExt=="jpg" || fileExt=="jpeg"){
        return "image"
    }
    return "file"
}



export {fileFormat }