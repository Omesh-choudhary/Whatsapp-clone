import { FiFileText } from "react-icons/fi"



 const RenderAttachment=(file,url)=>{

    switch (file) {
        case "video":
            return <video src={url} preload="none"  style={{objectFit:"fill"}} controls/>

         case "image":
            return <img src={url} preload="none" style={{objectFit:"fill"}} controls/>    
            
         case "audio":
            return <audio src={url} preload="none"  controls/>
        default:
           return <div className="text-white text-8xl w-fit"><FiFileText/></div>
    }
}

export default RenderAttachment