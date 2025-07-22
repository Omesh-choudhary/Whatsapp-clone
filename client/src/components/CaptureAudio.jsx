
import { HOST } from '../app/constants/constants'
import { SetAddMessage } from '../lib/features/user-feature/UserSlice'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { FaMicrophone, FaPause, FaPauseCircle, FaPlay } from 'react-icons/fa'
import { IoMdSend } from 'react-icons/io'
import WaveSurfer from 'wavesurfer.js'
import { useDispatch, useSelector } from 'react-redux'

function CaptureAudio() {
    const [IsRecording, setIsRecording] = useState(false)
    const [IsPlaying, setIsPlaying] = useState(false)
    const [RecordedAudio, setRecordedAudio] = useState(null)
    const [waveForm, setwaveForm] = useState(null)
    const [RecordingDuration, setRecordingDuration] = useState(0)
    const [currentPlaybackTime, setcurrentPlaybackTime] = useState(0)
    const [totalDuration, settotalDuration] = useState(0)
    const [renderedAudio,setrenderedAudio] = useState(null)

    const ChatUser = useSelector(state => state.ChatUser)
    const LoginUser = useSelector(state => state.LoginUser)
    const dispatch=useDispatch()
    const socket = useSelector(state=>state.socket)

    const audioRef = useRef(null)
    const mediaRecordedRef = useRef(null)
    const waveformRef = useRef(null)

  

    useEffect(()=>{
        const wavesurfer=WaveSurfer.create({
            container:waveformRef.current,
            waveColor:"#ccc",
            cursorColor:"#7ae3c3",
            progressColor:"#4a9eff",
            barWidth:2,
            height:30,
            responsive:true
        })

        setwaveForm(wavesurfer)
        wavesurfer.on("finish",()=>{
            setIsPlaying(false)
        })

        return ()=>{
            wavesurfer.destroy()
        }
    },[])

    useEffect(()=>{
        if(waveForm) handleStartRecording()
    },[waveForm])

    useEffect(()=>{
        if (RecordedAudio) {
            const updatePlaybackTime=()=>{
                setcurrentPlaybackTime(renderedAudio.currentTime)
            }
           RecordedAudio.addEventListener("timeupdate",updatePlaybackTime)

           return ()=>{
            RecordedAudio.removeEventListener("timeupdate",updatePlaybackTime)
           };
        }
    },[RecordedAudio])

      useEffect(()=>{
        let interval;
        if(IsRecording){
            interval=setInterval(()=>{
               setRecordingDuration((prev)=>{
                settotalDuration(prev+1);
                return prev+1;
               })
            },1000)
        }

        return ()=>{
            clearInterval(interval)
        }
    },[IsRecording]);

    const handleStartRecording=()=>{
        setRecordingDuration(0),
        setcurrentPlaybackTime(0),
        settotalDuration(0),
        setIsRecording(true)

        navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
            const mediarecorder = new MediaRecorder(stream);
            mediaRecordedRef.current=mediarecorder;
            audioRef.current.srcObject=stream;

            const chunks=[];
            mediarecorder.ondataavailable=(e)=>chunks.push(e.data);
            mediarecorder.onstop=()=>{
                const blob= new Blob(chunks,{type:"audio/ogg; codecs=opus"});
                const audioUrl = URL.createObjectURL(blob);
                const audio = new Audio(audioUrl);
                setRecordedAudio(audio);

                waveForm.load(audioUrl)

            }
            mediarecorder.start()
        }).catch((error)=>{
              console.log("error while recording",error)
        })
    }
    const handleStopRecording=()=>{
        if(mediaRecordedRef && IsRecording){
            mediaRecordedRef.current.stop();
            setIsRecording(false);
            waveForm.stop();

            const audioChunks=[];
            mediaRecordedRef.current.addEventListener("dataavailable",(event)=>{
              audioChunks.push(event.data)
            })

            mediaRecordedRef.current.addEventListener("stop",()=>{
              const audioblob=new Blob(audioChunks,{type:"audio/mp3"});
              const audioFile=new File([audioblob],"recording.mp3");
              setrenderedAudio(audioFile)
            })
        }
    }
    const handlePlayRecording=()=>{
        if (RecordedAudio) {
            waveForm.stop();
            waveForm.play();
            RecordedAudio.play();
            setIsPlaying(true) 
        }
    }
    const handlePauseRecording=()=>{
        waveForm.stop();
        RecordedAudio.pause();
        setIsPlaying(false)
    }


    const formatTime=(time)=>{

        if(isNaN(time)) return "00:00"

        const minutes=Math.floor(time/60);
        const seconds=Math.floor(time%60);

        return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`

    }

    const handleSendAudio=async()=>{
         
    const formData = new FormData()
    formData.append("audio",renderedAudio)
    
    const {data}=await axios.post(`${HOST}/api/user/add-audio-message/${LoginUser.id}/${ChatUser.id}`,
      formData,
     {
       headers:{
        "Content-Type":"multipart/form-data",
      }
     }
    )
    console.log(data.message)
    dispatch(SetAddMessage(data.message))


    socket.current.emit("send-msg",{
      to:ChatUser.id,
      from:LoginUser.id,
      message:data.message
    })
    }
  return (
    <div>
        <div className="recording mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-gray-700/80 rounded-2xl">
            {IsRecording?(
                <div className='text-red-500 animate-pulse 2-60 text-center'> 
                Recording <span>{RecordingDuration}s</span>
                </div>):
                (<div>
                 {RecordedAudio && <>{!IsPlaying?<FaPlay onClick={handlePlayRecording}/>:<FaPause onClick={handlePauseRecording}/>}</>}   
                </div>)}

                <div className='w-60' ref={waveformRef} hidden={IsRecording}/>

                {RecordedAudio && IsPlaying && (
                    <span>{formatTime(currentPlaybackTime)}</span>
                )}

                 {RecordedAudio && !IsPlaying && (
                    <span>{formatTime(totalDuration)}</span>
                )}

                <audio ref={audioRef} hidden/>

                <div className="mr-4">
                    {!IsRecording?(<FaMicrophone className='text-red-500'onClick={handleStartRecording} />):(<FaPauseCircle className='text-red-500'onClick={handleStopRecording}/>)}
                </div>

               <div><IoMdSend onClick={handleSendAudio} className='cursor-pointer mr-4 text-lg'/></div>
        </div>
    </div>
  )
}

export default CaptureAudio