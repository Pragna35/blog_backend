import mysql from "mysql2";

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Pragna@35",
    database:"user_auth"
});

// db.connect((err)=> {
//     if(err)  throw err;
//     console.log("connected to mysql")
// })