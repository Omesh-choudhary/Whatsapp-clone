import z from "zod"


let UserLoginSchema = z.object({
   
     email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least of 3 characters" })
    .max(255, { message: "Email must not be more than 255 characters" }),
     
     password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least of 6 characters" })
    .max(25,{message:"password must not be greater than 25 characters "}),
})

let UserSignUpSchema = UserLoginSchema.extend({
    name:z.string().
    min(3,{message:"name should be at least 3 chars"}).
    max(25,{message:"name can't be more than 25 chars"}),
})


export {UserLoginSchema,UserSignUpSchema}