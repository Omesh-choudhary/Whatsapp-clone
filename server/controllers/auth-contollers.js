import { success } from "zod/v4"
import { prisma } from "../DB/prisma/db.js"
import jsonWebToken from "../lib/jsonWebToken.js"
import { UserLoginSchema, UserSignUpSchema } from "../lib/userZodSchema.js"
import bcrypt from "bcryptjs"
import generateZegoToken from "../lib/GenerateToken.js"



const handleSignup=async(req,res,next)=>{

    const {name,email,password}=req.body

    const result = UserSignUpSchema.safeParse({name,email,password})

    if (result.success) {

        const existingUser = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if(!existingUser){
        const hashedPassword = await bcrypt.hash(password,10)
  let createdUser = await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword,
            provider:"credential",
            avatar:"https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
        }
    })
   let token = jsonWebToken(createdUser.id)
  
        
    return res.json({
        id:createdUser.id,
        name:createdUser.name,
        email:createdUser.email,
        avatar:createdUser.avatar,
        success:true,
        token
    })
   
                    }

                    else{
                        return res.json({error:"User already registered"})
                    }

                }
              else{
            const error =result.error.issues[0].message
            return res.json({error:error})
           }       

}




const handleLogin=async(req,res,next)=>{

    const {email,password}=req.body

    const result = UserLoginSchema.safeParse({email,password})

    if (result.success) {
       const existingUser =await prisma.user.findFirst({
        where:{
            email:email
        }
       })

       if(existingUser){
        const IsPasswordCorrect = bcrypt.compare(password,existingUser.password)

        if(IsPasswordCorrect){
  
   let token = jsonWebToken(existingUser.id)
       res.cookie("token",token)
    return res.json({
        id:existingUser.id,
        name:existingUser.name,
        email:existingUser.email,
        avatar:existingUser.avatar,
        success:true,
        token
    })
        }

        else{
             return res.json({error:"Invalid email or password"})
        }



       }
        else{
            return res.json({error:"Invalid email or password"})
        }

              }

           else{
            const error =result.error.issues[0].message
            return res.json({error:error})
           }   


}


const GenerateToken=(req,res,next)=>{

    const appId=parseInt(process.env.ZEGO_APP_ID)
    const serverSecret=process.env.ZEGO_SERVER_SECRET
    const userId=req.params.userId
    const effectivetime=3600
   

    if (appId && serverSecret && userId) {
        const token=generateZegoToken(appId,userId,serverSecret,effectivetime)
      return  res.status(200).json({token})
    }
   return res.status(400).send("all fields are required")
}





export {handleSignup,handleLogin,GenerateToken}