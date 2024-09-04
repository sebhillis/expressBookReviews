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
public_users.get('/', async (req, res) => {
  //Define function to be run asynchronously
  const getBooks = () => {
    return books
  }
  //Run the function asynchronously and process results
  try {
    const result = await getBooks()
    res.status(200).json(result)
  //Catch any asynchronous errors
  } catch (error) {
    res.status(500).json({ message: "Error processing request" })
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn
  //Define function to be run asynchronously
  const getBooks = (isbn) => {
    for (const idx in books) {
      if (idx === isbn) {
        return books[idx]
      }
    }
    return undefined
  }
  //Run the function asynchronously and process results
  try {
    const matchedBook = await getBooks(isbn)
    if (matchedBook) {
      res.status(200).json(matchedBook)
    } else {
      res.status(500).json({ message: "Book not found" })
    }
  //Catch any asynchronous errors
  } catch (error) {
    return res.status(500).json({ message: "Error processing request" })
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author
  //Define function to be run asynchronously
  getBooks = (author) => {
    let matchedBooks = []
    for (const idx in books) {
      let book = books[idx]
      if (book.author === author) {
          matchedBooks.push(book)
      }
    }
    return matchedBooks
  }
  //Run the function asynchronously and process results
  try {
    const result = await getBooks(author)
    res.status(200).json(result)
  //Catch any asynchronous errors
  } catch (error) {
    res.status(500).json({ message: 'Error processing request' })
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title
  //Define function to be run asynchronously
  const getBooks = (title) => {
    let matchedBooks = []
    for (const idx in books) {
      if (books[idx].title === title) {
        matchedBooks.push(books[idx])
      }
    }
    return matchedBooks
  }
  //Run the function asynchronously and process results
  try {
    const result = getBooks(title)
    res.status(200).json(result);
  //Catch any asynchronous errors
  } catch(error) {
    res.status(500).json({ message: 'Error processing request' })
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
