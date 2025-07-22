import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import authRouter from './routes/auth-route.js'
import userRouter from './routes/user-route.js'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'

dotenv.config({
    path:"./.env"
})
const app = express()

const port = process.env.PORT
app.use(cors({
    origin:"*"
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/uploads/images",express.static("uploads/images"))
app.use("/uploads/recordings",express.static("uploads/recordings"))
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.get('/', (req, res) => {
  res.send('Hello World')
})

const server = app.listen(port,()=>{
    console.log(`server listening on port ${port}`)
})

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000"
    }
});

  global.onlineUsers = new Map()

  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
      onlineUsers.set(userId,socket.id)
    })

    socket.on("send-msg",(data)=>{

      const sendUserSocket = onlineUsers.get(data.to)
      if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve",{
            from:data.from,
            message:data.message
        })
        }
    })

    socket.on("outgoing-video-call",(data)=>{
      
      const sendUserSocket=onlineUsers.get(parseInt(data.to))
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("incoming-video-call",{
          from:data.from,
          callType:data.callType,
          roomId:data.roomId
        })
        
      }
    })

     socket.on("outgoing-voice-call",(data)=>{
      const sendUserSocket=onlineUsers.get(parseInt(data.to))
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("incoming-voice-call",{
          from:data.from,
          callType:data.callType,
          roomId:data.roomId
        })
        
      }
    })

    socket.on("reject-voice-call",(data)=>{
      const sendUserSocket=onlineUsers.get(parseInt(data.from))
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("voice-call-rejected")
        
      }
    })

     socket.on("reject-video-call",(data)=>{
      const sendUserSocket=onlineUsers.get(parseInt(data.from))
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("video-call-rejected")
        
      }
    })

     socket.on("accept-Incoming-call",({id})=>{
      const sendUserSocket=onlineUsers.get(parseInt(id))
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("accept-call")
        
      }
    })


    
  });