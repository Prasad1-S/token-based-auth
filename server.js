import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import env from "dotenv";

// Mimicing DB
const users = [
    {id:1, username:'prasad', password:'prasadji'}
];

const SECRET = process.env.SECRET;
const apple = express();
const port = 30001;


apple.use(cors());
apple.use(express.json());

// verification middleware
function VerifyToken(req,res,nex){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //berarer <token>

    if(!token) return res.status(401).json({message:'No token provided'});
    
    jwt.verify(token, SECRET, (err, decoded)=>{
        if(err) return res.status(401).json({message:"Invalid or expired token."});

        req.user=decoded; //setting up the decoded token into req.user
        nex(); //token is valid go to the actual route
    })
}



apple.post('/login',(req,res)=>{
    const {username, password} = req.body;

    // DB validation using bcrypt module
    const user = users.find(u => u.username ===username && u.password === password);

    if(!user) return res.status(401).json({message:"Invalid Username & Password"});
    // siging the jwt
    const token = jwt.sign(
        {userId: user.id, username: user.username}, //payload to store in the token
        SECRET, // secret key
        {expiresIn:'2m'} //options
    );

    res.json({token});

});

apple.get('/secret',VerifyToken ,(req,res)=>{
    res.status(200).json({message:"successfully verified the json token"});
});

apple.get("/",(req,res)=>{
    res.status(200).json({Working:"app is working"});
});

apple.listen(port,()=>{
    console.log(`Server running at port: ${port}`);
});