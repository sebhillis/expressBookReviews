const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username": "User", "password": "Password"}];

const isValid = (username)=>{ //returns boolean
    let userMatches = users.filter((user) => {
      return user.username === username
    })

    if (userMatches.length > 0) {
      return true
    } else {
      return false
    }
}

const authenticatedUser = (username,password)=>{ 
    let validUsers = users.filter((user) => {
      return (user.username === username && user.password === password)
    })

    if (validUsers.length > 0) {
      return true
    } else {
      return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' })
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 })

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send('User successfully logged in')
  } else {
    return res.status(208).json({ message: 'Invalid login. Check username/password.' })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const review = req.query.review
  const username = req.session.authorization['username']

  const bookReviews = books[isbn].reviews
  if (bookReviews.length > 0) {
    let maxIdx = 0
    for (const idx in bookReviews) {
      if (idx > maxIdx) maxIdx = idx
      if (bookReviews[idx].username === username) {
        books[isbn].reviews[idx] = { username: username, review: review }
        return res.status(200).json({ message: 'Review successfully uploaded' })
      }
    }
    books[isbn].reviews[maxIdx + 1] = { username: username, review: review }
    return res.status(200).json({ message: 'Review successfully uploaded' })
  } else {
    books[isbn].reviews[0] = { username: username, review: review }
    return res.status(200).json({ message: 'Review successfully uploaded' })
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization['username']
  console.log(username)
  const bookReviews = books[isbn].reviews
  for (const idx in bookReviews) {
    if (bookReviews[idx].username === username) {
      books[isbn].reviews[idx] = {}
      return res.status(200).json({ message: 'Review successfully deleted' })
    }
  }
  return res.status(400).json({ message: 'No reviews from this user for that ISBN found' })
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
