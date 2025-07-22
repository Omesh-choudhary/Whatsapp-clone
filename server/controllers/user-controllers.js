import { prisma } from "../DB/prisma/db.js"
import fs from "fs"


const  handleGetUsers=async(req,res)=>{
    const {id}=req.params
    const senderId = parseInt(id)

 try {

     const users = await prisma.user.findMany({
        
        where:{
            id:{
                not:senderId
            }
        },

        orderBy:{name:"asc"},
        select:{
            id:true,
            name:true,
            email:true,
            avatar:true,  
            bio:true
            
        }

    })
    
    const userGroupByIntialLetter={}

    
    users.forEach((user)=>{
        const initialLetter=user.name.charAt(0).toUpperCase();
        if(!userGroupByIntialLetter[initialLetter]){
            userGroupByIntialLetter[initialLetter]=[]
        }

        userGroupByIntialLetter[initialLetter].push(user)
    })
    return  res.json({
       users: userGroupByIntialLetter
    })
    
   } catch (error) {
    console.log(error)
   }

}

const handleAddMessage=async(req,res,next)=>{
    
    const {message,from,to}=req.body
    try {
        
        const getUser= onlineUsers.get(to)
      if (message && from && to) {

        const newMessage=  await prisma.message.create({
            data:{
               message,
               senderId:parseInt(from),
               receiverId:parseInt(to),
               messageStatus:getUser?"delivered":"sent"
            },
            include:{sender:true,receiver:true}
        })

        res.status(201).json({message:newMessage})
      }
      else{
        res.status(400).send("all fields are required")
      }
        
    } catch (error) {
        next(error)
    }

}

const handleGetMessages=async(req,res)=>{
    const {from,to}=req.params
    

    try {

        if (from && to) {

            const messages =await prisma.message.findMany({
                where:{
                    OR:[
                        {
                            senderId:parseInt(from),
                            receiverId:parseInt(to)
                        },
                        {
                            senderId:parseInt(to),
                            receiverId:parseInt(from)
                        }
                    ]
                },

                orderBy:{
                    createdAt:"asc"
                }
            })


            


            const unreadmessages =[]

             messages?.forEach((message,index)=>{
                if(message.messageStatus!=="read" && message.senderId===parseInt(to)){
                    message.messageStatus="read";
                    unreadmessages.push(message.id)
                }
            })

            await prisma.message.updateMany({
                where:{
                    id:{in:unreadmessages}
                },
                data:{
                    messageStatus:"read"
                }
            })


            res.status(200).json({messages})
            
        }
        else{
            res.status(400).json({error:"all fields are required"})
        }
        
    } catch (error) {
        console.log(error)
    }
}

const handleImageMessage=async(req,res)=>{
   const {from,to}=req.params
   
    if(req.file){
        const date = Date.now()
        const getUser= onlineUsers.get(parseInt(to))
        

        let fileName = "uploads/images/"+date+req.file.originalname;
       
            fs.renameSync(req.file.path,fileName)

        const message = await prisma.message.create({
            data:{
               message:fileName,
               senderId:parseInt(from),
               receiverId:parseInt(to),
               type:"image",
               messageStatus:getUser?"delivered":"sent"
            }
        })
   
        return res.status(200).json({message})

    }
}

const handleAudioMessage=async(req,res)=>{
   const {from,to}=req.params
   
    if(req.file){
        const date = Date.now()
        const getUser= onlineUsers.get(parseInt(to))

        let fileName = "uploads/recordings/"+date+req.file.originalname;
       
            fs.renameSync(req.file.path,fileName)

        const message = await prisma.message.create({
            data:{
               message:fileName,
               senderId:parseInt(from),
               receiverId:parseInt(to),
               type:"audio",
               messageStatus:getUser?"delivered":"sent"
            }
        })
   
        return res.status(200).json({message})

    }
}

const handleGetIntialContacts=async(req,res)=>{
    const {from}=req.params
    

    try {

        if (from) {

            const user =await prisma.user.findUnique({
                where:{id:parseInt(from)},
                include:{
                    sentMessages:{
                        include:{
                            receiver:{
                                omit:{
                                    createdAt:true
                                }
                            },
                            sender:{
                                omit:{
                                    createdAt:true
                                }
                            },
                            
                        },
                        orderBy:{
                            createdAt:"desc"
                        }
                    },
                    receiveMessages:{
                        include:{
                            receiver:{
                                omit:{
                                    createdAt:true
                                }
                            },
                            sender:{
                                omit:{
                                    createdAt:true
                                }
                            },
                            
                        },
                        orderBy:{
                            createdAt:"desc"
                        } 
                    }
                }
                    
            })

            
            const messages=[...user.sentMessages,...user.receiveMessages];
            messages.sort((a,b)=>b.createdAt.getTime()-a.createdAt.getTime())
            
            
            const users=new Map()
            const messageStatusChange=[];

            messages.forEach((msg)=>{
                const isSender=msg.senderId===parseInt(from);
                const calculatedId=isSender?msg.receiverId:msg.senderId;
                if (msg.messageStatus==="sent") {
                    messageStatusChange.push(msg.id)
                }

                if (!users.get(calculatedId)) {
                   const {id,type,message,messageStatus,receiverId,senderId,createdAt}=msg 
                   let user={
                    messageId:id,
                    type,message,
                    messageStatus,
                    receiverId,
                    senderId,
                    createdAt
                   }
                   if (isSender) {
                       user={
                           ...user,
                           ...msg.receiver,
                           totalUnreadMessages:0
                        }
                       
                   }else{
                    user={
                        ...user,
                        ...msg.sender,
                        totalUnreadMessages:messageStatus !=="read"?1:0
                    }
                   }

                   users.set(calculatedId,{...user})
                  
                }else if(msg.messageStatus==="read" && !isSender){
                     const user=users.get(calculatedId)

                     users.set(calculatedId,{
                        ...user,
                        totalUnreadMessages:user.totalUnreadMessages+1
                     })
                }
            })


            

           if (messageStatusChange.length) {
             await prisma.message.updateMany({
                where:{
                    id:{in:messageStatusChange}
                },
                data:{
                    messageStatus:"delivered"
                }
            })

           }
              
            res.status(200).json({
                users:Array.from(users.values()),
                onlineUsers:Array.from(onlineUsers.keys())
            })
            
        }
        else{
            res.status(400).json({error:"all fields are required"})
        }
        
    } catch (error) {
        console.log(error)
    }
}



export {handleGetUsers,handleAddMessage,handleGetMessages,handleImageMessage,handleAudioMessage,handleGetIntialContacts}