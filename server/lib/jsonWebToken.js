import jwt from "jsonwebtoken"

function jsonWebToken(id) {

 return   jwt.sign(
        {
          id
       },
       process.env.JWT_TOKEN_SECRET,
       {expiresIn:"24h"}
)
  
}

export default jsonWebToken