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

// Get the book list available in the shop with async/await
public_users.get('/books', async function (req, res) {

  try {
    const booksAsync = await new Promise((resolve, reject) => {
      resolve(JSON.stringify(books));
    });
  
    res.send(booksAsync);
    console.log("Promise for Task 10 resolved");
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("An error occurred while fetching the book list.");
  }    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if(book) { res.send(book);}
  else { res.send("there is no ISBN that matches the one you provided"); }
});

// Get book details based on ISBN with async/await
public_users.get('/isbnAsync/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  try {
      const bookAsync = await new Promise((resolve, reject) => {
        resolve(JSON.stringify(book));
      });
    
      res.send(bookAsync);
      console.log("Promise for Task 11 resolved");
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send("An error occurred while fetching the books based on ISBN.");
    } 
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

// Get book details based on author with async/await
public_users.get('/authorAsync/:author', async function (req, res) {
  let author = req.params.author;
  let booksbyAuthor = [];
  
  for (let key in books) {
    if (books[key].author === author) {
      booksbyAuthor.push(books[key]);
    }
  }
  try {
      const booksbyAuthorAsync = await new Promise((resolve, reject) => {
        resolve(JSON.stringify(booksbyAuthor));
      });
    
      res.send(booksbyAuthorAsync);
      console.log("Promise for Task 12 resolved");
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send("An error occurred while fetching the books based on author.");
    }   
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

// Get all books based on title with async/await
public_users.get('/titleAsync/:title', async function (req, res) {
  let title = req.params.title;
  let booksbyTitle = [];

  for (let key in books) {
    if (books[key].title === title) {
        booksbyTitle.push(books[key]);
    }
  }
  try {
      const booksbyTitleAsync = await new Promise((resolve, reject) => {
        resolve(JSON.stringify(booksbyTitle));
      });
    
      res.send(booksbyTitleAsync);
      console.log("Promise for Task 13 resolved");
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send("An error occurred while fetching the books based on title.");
    } 
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if(book) {res.send(book.reviews)}
  else {res.send("there is no ISBN that matches the one you provided");}
});

module.exports.general = public_users;
