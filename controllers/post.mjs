import {db} from "../db.js"
import jwt from "jsonwebtoken";


//  token verification to delete and edit the post using miidleware(verifyToken)
 export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    
    if (!token) return res.status(403).json("Token is required! you are not authenticated.");
  
    // Strip 'Bearer ' prefix
    const bearerToken = token.split(" ")[1];
    
  
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json("Invalid token!");
      
      req.user = user; // Add user info to request
      next();
    });
  };

export const getPosts = (req,res) => {


    const query = req.query.cat ? "select * from blog_posts where category=?" : "select * from blog_posts";


    db.query(query,[req.query.cat],(err,data) => {

        if(err) return res.status(500).send(err);

       // console.log("fetched data" , data)

        return res.status(200).json(data);
    })
}

export const getPost = (req,res) => {
   const query = "select p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `category`, `date` from blog_users u join blog_posts p ON u.id =p.uid where p.id = ?" 

   db.query(query,[req.params.id],(err,data) => {

    if(err) return res.status(500).send(err);

    return res.status(200).json(data[0])
   })
}

export const addPost = (req,res) => {
  // console.log(req.body)
    const {title,desc,cat, date} = req.body;
  
    const img = req.body.img || null;  //if there is no img selected ,set it to null
    const userId = req.user.id;  //from middleware (verifyToken)

    const insertQuery = "insert into blog_posts (`title`, `desc`, `category`,`img`,`date`, `uid`) values (?, ?, ?, ?, ?, ?)";

   db.query(insertQuery, [title, desc, cat, img, date, userId], (err, data) => {
    if(err) return res.status(500).send(err);

    return res.status(200).json("post created successfully.")
   })
}

export const deletePost = (req,res) => {

    const postId = req.params.id;
  const userId = req.user.id;  // From the verified token


   // Step 3: Proceed to delete the post
   const deleteQuery = "delete from blog_posts where id = ? And `uid` = ?";
   db.query(deleteQuery, [postId, userId], (err, data) => {
    if(err) return res.status(500).send("An error occurred while processing your request",err);


    if (data.affectedRows === 0) {
        return res.status(403).json("You are not authorized to delete this post or the post does not exist.");
      }
     return res.status(200).json("Post deleted successfully.");
   });
}

export const updatePost = (req,res) => {
  // console.log(req.body)

 const postId = req.params.id;
 const userId = req.user.id;


 const values = [req.body.title, req.body.desc, req.body.cat, req.body.img]

 const updateQuery = "update blog_posts set `title` = ?, `desc` = ?, `category` = ?, `img` = ? where `id` = ? and `uid` = ?";

 db.query(updateQuery,[...values, postId, userId],(err, data) => {
  if (err) return res.status(500).json("Error while updating the post.");

  if (data.affectedRows === 0) {
    return res.status(403).json("You are not authorized to update this post or the post does not exist.");
  }

  return res.status(200).json("Post updated successfully.")

 });
};

