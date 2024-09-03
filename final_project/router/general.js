const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username
    const password = req.body.password
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and/or password not provided.' })
    }
  
    if (typeof(username) !== 'string' || typeof(password) !== 'string') {
      return res.status(400).json({ message: 'Username and password must both be string values' })
    }
  
    const exists = users.filter((user) => user.username === username)
    if (exists.length > 0) {
      return res.status(400).json({ message: 'Username already exists' })
    }
  
    users.push({ username: username, password: password })
    return res.status(200).json({ message: `User with username ${username} successfuly registered` })
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  for (const idx in books) {
    if (idx === isbn) {
      return res.status(200).json(books[idx])
    }
  }
  return res.status(500).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  let matchedBooks = []
  for (const idx in books) {
    let book = books[idx]
    if (book.author === author) {
        matchedBooks.push(book)
    }
  }
  return res.status(200).json(matchedBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  let matchedBooks = []
  for (const idx in books) {
    let book = books[idx]
    if (book.title === title) {
      matchedBooks.push(book)
    }
  }
  return res.status(200).json(matchedBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
