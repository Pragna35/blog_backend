import express from "express";

import {getPosts,getPost, addPost, deletePost,updatePost } from "../controllers/post.mjs"
 import { verifyToken } from "../controllers/post.mjs";


const router = express.Router();

router.get("/", getPosts)
router.get("/:id", getPost)
router.post("/", verifyToken, addPost)
router.delete("/:id",verifyToken, deletePost)
router.patch("/:id",verifyToken,updatePost)


export default router;