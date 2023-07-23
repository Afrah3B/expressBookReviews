const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  /*if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }*/
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
  //return res.status(300).json({message: "Yet to be implemented"});
});
public_users.get("/asynbooks", async function (req,res) {
    try {
      let response = await axios.get("http://localhost:5005/");
      console.log(response.data);
      return res.status(200).json(response.data);
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: "Error getting book list"});
    }
  });
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/user',function (req, res) {
    //Write your code here
    res.send(JSON.stringify(users,null, 4));
    //return res.status(300).json({message: "Yet to be implemented"});
  });

  public_users.get("/isbn/:isbn", async function (req, res) {
    //Write your code here
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(books[req.params.isbn]), 600);
    });
  
    const book = await promise;
  
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
 public_users.get("/author/:author", async function (req, res) {
    //Write your code here
    const authorName = req.params.author;
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter(
          (b) => b.author === authorName
        );
        resolve(filteredBooks);
      }, 600);
    });
  
    const filteredBooks = await promise;
  
    if (filteredBooks.length > 0) {
      return res.status(200).json({ books: filteredBooks });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorBooks = [];  
  
  for (const book in books) {  
    if (books[book].author === author) {  
      authorBooks.push(books[book]);
    }
  }
  
  if (authorBooks.length > 0) {  
    res.send(authorBooks);  
  } else {
    res.status(404).send('No books found for author');  
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});
  
  public_users.get("/title/:title", async function (req, res) {
    //Write your code here
    const title = req.params.title;
  
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter(
          (b) => b.title === title
        );
        return resolve(filteredBooks);
      }, 600);
    });
  
    const filteredBooks = await promise;
  
    if (filteredBooks.length > 0) {
      return res.status(200).json({ books: filteredBooks });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleBooks = [];  
  
  for (const book in books) {  
    if (books[book].title === title) {  
        titleBooks.push(books[book]);
    }
  }
  
  if (titleBooks.length > 0) {  
    res.send(titleBooks);  
  } else {
    res.status(404).send('No books found for title');  
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    const reviews = books[isbn].reviews;
    return res.status(200).json({ reviews: reviews });
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
