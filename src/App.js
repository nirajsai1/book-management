import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const validatePassword = (value) => {
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return strongPasswordPattern.test(value);
  };

  const checkData = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const passwordValue = password;

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!passwordValue) {
      setError("Password is required");
      return;
    }

    if (!validatePassword(passwordValue)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (!isLogin && trimmedName.length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    if (isLogin) {
      try {
        const res = await axios.get(
          "https://6a1433cf6c7db8aac054092c.mockapi.io/api/users"
        );

        const user = res.data.find(
          (u) => u.Email === trimmedEmail && u.Password === passwordValue
        );

        if (user) {
          localStorage.setItem("userId", user.id);
          localStorage.setItem("userName", user.Name);
          navigate("/home");
        } else {
          setError("Invalid email or password");
        }
      } catch (err) {
        setError("Something went wrong");
      }
    } else {
      try {
        const res = await axios.post(
          "https://6a1433cf6c7db8aac054092c.mockapi.io/api/users",
          {
            Name: trimmedName,
            Email: trimmedEmail,
            Password: passwordValue,
          }
        );

        localStorage.setItem("userId", res.data.id);
        localStorage.setItem("userName", trimmedName);
        navigate("/home");
      } catch (err) {
        setError("Registration failed");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <div style={styles.header}>
          <h1 style={styles.title}>📚 Book Tracker</h1>
          <p style={styles.subtitle}>
            Manage your reading journey
          </p>
        </div>

        
        <div style={styles.toggleBox}>
          <button
            style={
              isLogin
                ? styles.activeToggle
                : styles.inactiveToggle
            }
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            style={
              !isLogin
                ? styles.activeToggle
                : styles.inactiveToggle
            }
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        
        {error && <p style={styles.error}>{error}</p>}

      
        <div style={styles.form}>
          {!isLogin && (
            <input
              style={styles.input}
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            style={styles.input}
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            style={styles.button}
            onClick={checkData}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;



const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f1ea",
    fontFamily: "Arial",
    padding: "20px",
  },

  card: {
    width: "380px",
    backgroundColor: "#fffdf9",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(90,70,50,0.1)",
  },

  header: {
    textAlign: "center",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    color: "#5c4432",
  },

  subtitle: {
    marginTop: "6px",
    fontSize: "14px",
    color: "#8b7355",
  },

  toggleBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  activeToggle: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#a98467",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  inactiveToggle: {
    flex: 1,
    padding: "10px",
    border: "1px solid #d8c3b5",
    borderRadius: "8px",
    backgroundColor: "#fffaf5",
    color: "#5c4432",
    cursor: "pointer",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d8c3b5",
    backgroundColor: "#fffaf5",
    outline: "none",
    color: "#5c4432",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#a98467",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "5px",
  },

  error: {
    color: "#c62828",
    fontSize: "13px",
    textAlign: "center",
    marginBottom: "10px",
  },
};