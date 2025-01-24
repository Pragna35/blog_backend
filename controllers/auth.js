import {db} from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = (req,res) => {

    //checking existing user

    const q = "select * from blog_users where username = ? "
    db.query(q,[req.body.username],(err,data)=> {
        if(err) {
            return res.json(err)
        }
        if(data.length > 0){
            return res.status(409).json("user already exists!");
        }
        //hashing password and creating a user
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(req.body.password, salt);

        const insert_query = "insert into blog_users (username,password,email) values(?,?,?)"

        const values = [req.body.username,hashedPass,req.body.email]
        db.query(insert_query,values,(err,data) => {
            if(err) {
                return res.json(err)
            }
            return res.status(201).json("user registered successfully.")
        })
    })
}

export const login = (req,res) => {
//checking user exist or not

const q = "select * from blog_users where username = ?"

db.query(q,[req.body.username], (err,data) => {
    if(err)  return res.json(err);
    if(data.length === 0) return res.status(404).json("user not found");

    //verifying password

    const isPassCorect = bcrypt.compareSync(req.body.password, data[0].password);

    if(!isPassCorect) return res.status(400).json("wrong username or password");

    const token = jwt.sign({id:data[0].id},process.env.JWT_SECRET);
    
    const {password, ...userDetails} = data[0]

    res.json({token,userData:userDetails})
   
})

}

 export const logout = (req,res) => {
res.status(200).json("logged out successfully")
 }

  