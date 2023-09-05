const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;  

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  
  if (!username && !password) {
    return res.status(400).json({ message: "Please provide a username and password." });
  } else if (!username) {
    return res.status(400).json({ message: "Please provide a username." });
  } else if (!password) {
    return res.status(400).json({ message: "Please provide a password." });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));   
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if(book) { res.send(book);}
  else { res.send("there is no ISBN that matches the one you provided"); }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let booksbyAuthor = [];

  for (let key in books) {
    if (books[key].author === author) {
      booksbyAuthor.push(books[key]);
    }
  }
  res.send(JSON.stringify(booksbyAuthor));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let booksbyTitle = [];

  for (let key in books) {
    if (books[key].title === title) {
        booksbyTitle.push(books[key]);
    }
  }
  res.send(JSON.stringify(booksbyTitle));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if(book) {res.send(book.reviews)}
  else {res.send("there is no ISBN that matches the one you provided");}
});

module.exports.general = public_users;
