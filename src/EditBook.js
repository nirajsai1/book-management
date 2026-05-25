import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const API =
    "https://6a1433cf6c7db8aac054092c.mockapi.io/api/books";

  const [book, setBook] = useState(null);

  const [pagesRead, setPagesRead] = useState(0);
  const [completed, setCompleted] = useState(false);


  useEffect(() => {
    const fetchBook = async () => {
      const res = await axios.get(`${API}/${id}`);

      setBook(res.data);
      setPagesRead(res.data.PagesRead || 0);
      setCompleted(res.data.Completed || false);
    };

    fetchBook();
  }, [id]);

 
  const handleSlider = (value) => {
    setPagesRead(value);

    if (book && value >= book.Pages) {
      setCompleted(true);
    } else {
      setCompleted(false);
    }
  };

  
  const handleCompleted = (checked) => {
    setCompleted(checked);

    if (checked && book) {
      setPagesRead(book.Pages);
    }
  };

  const handleBookChange = (field, value) => {
    setBook((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "Pages") {
      const pagesValue = Number(value);
      if (pagesValue < pagesRead) {
        setPagesRead(pagesValue);
      }
    }
  };


  const updateBook = async () => {
    await axios.put(`${API}/${id}`, {
      ...book,
      PagesRead: pagesRead,
      Completed: completed,
      UserId: userId,
    });

    navigate("/home");
  };

  if (!book)
    return (
      <div style={loadingContainer}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div style={loadingCard}>
          <div style={spinner} />
          <p style={loadingText}>Loading book details...</p>
        </div>
      </div>
    );

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ color: "#5c4432" }}>
          Edit Book Details
        </h2>

        <div style={fieldGroup}>
          <label style={label}>Book Name</label>
          <input
            value={book.BookName}
            onChange={(e) => handleBookChange("BookName", e.target.value)}
            style={textInput}
          />
        </div>

        <div style={fieldGroup}>
          <label style={label}>Author</label>
          <input
            value={book.Author}
            onChange={(e) => handleBookChange("Author", e.target.value)}
            style={textInput}
          />
        </div>

        <div style={fieldGroup}>
          <label style={label}>Genre</label>
          <input
            value={book.Genre || ""}
            onChange={(e) => handleBookChange("Genre", e.target.value)}
            style={textInput}
          />
        </div>

        <div style={fieldGroup}>
          <label style={label}>Total Pages</label>
          <input
            type="number"
            min="1"
            value={book.Pages}
            onChange={(e) => handleBookChange("Pages", Number(e.target.value))}
            style={textInput}
          />
        </div>

        <label>Pages Read: {pagesRead}</label>

        <input
          type="range"
          min="0"
          max={book.Pages}
          value={pagesRead}
          onChange={(e) =>
            handleSlider(Number(e.target.value))
          }
          style={{ width: "100%" }}
        />

      
        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) =>
                handleCompleted(
                  e.target.checked
                )
              }
            />
            {" "} Mark as Completed
          </label>
        </div>

        <div style={actionRow}>
          <button
            style={backButton}
            onClick={() => navigate("/home")}
          >
            Back
          </button>

          <button
            onClick={updateBook}
            style={button}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const container = {
  minHeight: "100vh",
  background: "#f5f1ea",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  width: "420px",
  background: "#fffdf9",
  padding: "30px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  boxShadow:
    "0 2px 8px rgba(90,70,50,0.08)",
};

const loadingContainer = {
  minHeight: "100vh",
  background: "#f5f1ea",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const loadingCard = {
  width: "320px",
  padding: "30px",
  borderRadius: "14px",
  background: "#fffdf9",
  boxShadow: "0 2px 10px rgba(90,70,50,0.12)",
  textAlign: "center",
};

const spinner = {
  width: "48px",
  height: "48px",
  margin: "0 auto 16px",
  border: "5px solid #d8c3b5",
  borderTopColor: "#a98467",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const loadingText = {
  margin: 0,
  color: "#5c4432",
  fontWeight: "600",
};

const button = {
  background: "#a98467",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const backButton = {
  background: "#8d6e63",
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

const fieldGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginBottom: "12px",
};

const label = {
  color: "#5c4432",
  fontWeight: "600",
};

const textInput = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d8c3b5",
  background: "#fffaf5",
  color: "#5c4432",
};

export default EditBook;