import { useSelector } from 'react-redux'
import { HOST } from '../app/constants/constants'
import React, { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import WaveSurfer from 'wavesurfer.js'


function VoiceMessage(message) {
    const LoginUser=useSelector(state=>state.LoginUser)
    const [IsPlaying, setIsPlaying] = useState(false)
    const [AudioMessage, setAudioMessage] = useState(null)
    const [currentPlaybackTime, setcurrentPlaybackTime] = useState(0)
    const [totalDuration, settotalDuration] = useState(0)

    const waveForm = useRef(null)
    const waveFormRef = useRef(null)

    
    useEffect(()=>{
         waveForm.current=WaveSurfer.create({
            container:waveFormRef.current,
            waveColor:"#ccc",
            cursorColor:"#7ae3c3",
            progressColor:"#4a9eff",
            barWidth:2,
            height:30,
            responsive:true
        })

        
        waveForm.current.on("finish",()=>{
            setIsPlaying(false)
        })

        return ()=>{
            waveForm.current.destroy()
        }
    },[])

    useEffect(()=>{
        const audioURL=`${HOST}/${message.message}`
        const audio = new Audio(audioURL)

        setAudioMessage(audio)
        waveForm.current.load(audioURL)
        waveForm.current.on("ready",()=>{
            settotalDuration(waveForm.current.getDuration())
        })
        
    },[message.message])


    useEffect(()=>{
        if (AudioMessage) {
            const updatePlaybackTime=()=>{
                setcurrentPlaybackTime(AudioMessage.currentTime)
            }
           AudioMessage.addEventListener("timeupdate",updatePlaybackTime)

           return ()=>{
            AudioMessage.removeEventListener("timeupdate",updatePlaybackTime)
           };
        }
    },[AudioMessage])

    const formatTime=(time)=>{

        if(isNaN(time)) return "00:00"

        const minutes=Math.floor(time/60);
        const seconds=Math.floor(time%60);

        return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`

    }

    const handlePlayAudio=()=>{
        if(AudioMessage){
            waveForm.current.stop();
            waveForm.current.play();
            AudioMessage.play()
            setIsPlaying(true)
        }
    }

     const handlePauseAudio=()=>{
            waveForm.current.stop();
            AudioMessage.pause()
            setIsPlaying(false)
        
    }

  return (
    <div>
        <div className="audio flex gap-2 items-center justify-center">
            <h1 className="img w-7 h-7 rounded-full overflow-clip">
                <img className='object-cover' src={LoginUser.photo} alt="" />
            </h1>
            <div className="icon">
                {!IsPlaying?<FaPlay onClick={handlePlayAudio}/>:<FaPause onClick={handlePauseAudio}/>}
            </div>
            <div className='w-20 overflow-y-auto' ref={waveFormRef}/>
            <div className="time">
                {formatTime(IsPlaying?currentPlaybackTime:totalDuration)}
            </div>
        </div>
        <audio src={`${HOST}/${message.message}`} hidden></audio>
    </div>
  )
}

export default VoiceMessage