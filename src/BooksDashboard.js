import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BooksDashboard = () => {
  const API =
    "https://6a1433cf6c7db8aac054092c.mockapi.io/api/books";

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState("All");


  const fetchBooks = async () => {
    try {
      const res = await axios.get(API);

      const userBooks = res.data.filter(
        (b) => b.UserId == userId
      );

      setBooks(userBooks);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  
  const deleteBook = async (id) => {
    try {

      await  axios.delete(`${API}/${id}`);
      fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.BookName?.toLowerCase().includes(search.toLowerCase()) ||
      book.Author?.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
      filterGenre  === "All" || book.Genre === filterGenre;

    return matchesSearch && matchesGenre;
  });

  
  const openBooks = books.filter((b) => !b.Completed);
  const completedBooks = books.filter((b) => b.Completed);

 
  const genreCount = {};

  completedBooks.forEach((b) => {
    genreCount[b.Genre]  = (genreCount[b.Genre] || 0) + 1;
  });

  const favouriteGenre =
    Object.keys(genreCount).length > 0
      ? Object.keys(genreCount).reduce((a, b) =>
          genreCount[a] > genreCount[b] ? a : b
        )
      : "N/A";

  const genres = ["All", ...new Set(books.map((b) => b.Genre))];

  return (
    <div style={container}>
      <div style={card}>
        
        <div style={header}>
          <div>
            <h1 style={title}>📚 My Book Dashboard</h1>
            <p style={subtitle}>Welcome, {userName}</p>
          </div>

          <div style={headerActions}>
            <button
              style={addButton}
              onClick={() => navigate("/add-book")}
            >
              Add Book
            </button>

            <button
              style={logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        
        <div style={statsContainer}>
          <div style={statCard}>
            <h3>Open Books</h3>
            <p>{openBooks.length}</p>
          </div>

          <div style={statCard}>
            <h3>Completed</h3>
            <p>{completedBooks.length}</p>
          </div>

          <div style={statCard}>
            <h3>Favourite Genre</h3>
            <p>{favouriteGenre}</p>
          </div>
        </div>

       
        <div style={filterContainer}>
          <input
            placeholder="Search by book or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={input}
          />

          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            style={input}
          >
            {genres.map((g, i) => (
              <option key={i}>{g}</option>
            ))}
          </select>
        </div>

       
        <table style={table}>
          <thead>
            <tr style={thead}>
              <th style={th}>Book</th>
              <th style={th}>Author</th>
              <th style={th}>Genre</th>
              <th style={th}>Pages Read</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id} style={row}>
                <td style={td}>{book.BookName}</td>
                <td style={td}>{book.Author}</td>
                <td style={td}>{book.Genre}</td>
                <td style={td}>
                  {book.PagesRead || 0}/{book.Pages}
                </td>

                <td style={td}>
                  {book.Completed ? (
                    <span style={done}>Completed</span>
                  ) : (
                    <span style={open}>In Progress</span>
                  )}
                </td>

                <td style={td}>
                  <div style={actionBox}>
                    <button
                      style={editBtn}
                      onClick={() =>
                        navigate(`/edit-book/${book.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={deleteBtn}
                      onClick={() => deleteBook(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBooks.length === 0 && (
          <p style={emptyText}>No books found</p>
        )}
      </div>
    </div>
  );
};


const container = {
  minHeight: "100vh",
  backgroundColor: "#f5f1ea",
  padding: "40px",
  fontFamily: "Arial",
};

const card = {
  maxWidth: "1100px",
  margin: "auto",
  backgroundColor: "#fffdf9",
  padding: "30px",
  borderRadius: "14px",
  boxShadow: "0 2px 8px rgba(90,70,50,0.08)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const title = {
  margin: 0,
  color: "#5c4432",
};

const subtitle = {
  color: "#8b7355",
};

const addButton = {
  backgroundColor: "#a98467",
  color: "white",
  border: "none",
  padding: "12px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const logoutButton = {
  backgroundColor: "#8d6e63",
  color: "white",
  border: "none",
  padding: "12px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const headerActions = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const statsContainer = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
};

const statCard = {
  flex: 1,
  background: "#fffaf5",
  border: "1px solid #e7d9cc",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center",
  color: "#5c4432",
};

const filterContainer = {
  display: "flex",
  gap: "15px",
  marginBottom: "20px",
};

const input = {
  flex: 1,
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d8c3b5",
  backgroundColor: "#fffaf5",
};



const table = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 10px",
};

const thead = {
  backgroundColor: "#b08968",
  color: "white",
  textAlign: "left",
};

const th = {
  padding: "14px 12px",
  fontSize: "14px",
};

const row = {
  backgroundColor: "#fffaf5",
  boxShadow: "0 1px 3px rgba(90,70,50,0.08)",
};

const td = {
  padding: "14px 12px",
  verticalAlign: "middle",
  color: "#5c4432",
  fontSize: "14px",
};

const done = {
  color: "#2e7d32",
  fontWeight: "bold",
};

const open = {
  color: "#a98467",
  fontWeight: "bold",
};

const actionBox = {
  display: "flex",
  gap: "10px",
};

const editBtn = {
  backgroundColor: "#c6a27e",
  border: "none",
  color: "white",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  backgroundColor: "#8d6e63",
  border: "none",
  color: "white",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const emptyText = {
  textAlign: "center",
  marginTop: "20px",
  color: "#8b7355",
};

export default BooksDashboard;