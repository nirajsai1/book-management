import { useState } from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();

  const userId =
    localStorage.getItem("userId");

  const [bookName, setBookName] =
    useState("");

  const [author, setAuthor] =
    useState("");

  const [genre, setGenre] =
    useState("");

  const [pages, setPages] =
    useState("");

  const addBook = async () => {
    try {
      await axios.post(
        "https://6a1433cf6c7db8aac054092c.mockapi.io/api/books",
        {
          BookName: bookName,
          Author: author,
          Genre: genre,
          Pages: pages,
          PagesRead:0,
          UserId: userId,
        }
      );

      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1>Add Book</h1>

        <input
          placeholder="Book Name"
          style={input}
          value={bookName}
          onChange={(e) =>
            setBookName(e.target.value)
          }
        />

        <input
          placeholder="Author"
          style={input}
          value={author}
          onChange={(e) =>
            setAuthor(e.target.value)
          }
        />

        <input
          placeholder="Genre"
          style={input}
          value={genre}
          onChange={(e) =>
            setGenre(e.target.value)
          }
        />

        <input
          placeholder="Pages"
          style={input}
          value={pages}
          onChange={(e) =>
            setPages(e.target.value)
          }
        />

        <div style={actionRow}>
          <button
            style={backButton}
            onClick={() => navigate("/home")}
          >
            Back
          </button>

          <button
            style={button}
            onClick={addBook}
          >
            Add Book
          </button>
        </div>
      </div>
    </div>
  );
};

const container = {
  minHeight: "100vh",
  backgroundColor: "#f5f1ea",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  width: "400px",
  backgroundColor: "#fffdf9",
  padding: "30px",
  borderRadius: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d8c3b5",
};

const button = {
  backgroundColor: "#a98467",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const backButton = {
  backgroundColor: "#8d6e63",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const actionRow = {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  marginTop: "10px",
};

export default AddBook;