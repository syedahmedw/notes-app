import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8080";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return token ? <Dashboard setToken={setToken} /> : <Login setToken={setToken} />;
}

// 🔐 LOGIN + SIGNUP
function Login({ setToken }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    const url = isSignup
        ? `${BASE_URL}/auth/signup`
        : `${BASE_URL}/auth/login`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.text();

    if (isSignup) {
      if (data.includes("exists")) {
        alert("Username already exists ❌");
      } else {
        alert("Signup successful ✅");
        setIsSignup(false);
      }
      return;
    }

    if (data === "USER_NOT_FOUND") {
      alert("User does not exist ❌");
      return;
    }

    if (data === "WRONG_PASSWORD") {
      alert("Incorrect password ❌");
      return;
    }

    localStorage.setItem("token", data);
    setToken(data);
  };

  return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-80">
          <h2 className="text-white text-2xl mb-6 text-center font-semibold">
            {isSignup ? "Create Account 🚀" : "Welcome Back 👋"}
          </h2>

          <input
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
          />

          <input
              type="password"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
          />

          <button
              className="w-full bg-green-500 hover:bg-green-600 p-2 rounded text-white"
              onClick={handleAuth}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <p
              className="text-gray-400 text-sm mt-4 text-center cursor-pointer hover:underline"
              onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
                ? "Already have an account? Login"
                : "New user? Create account"}
          </p>
        </div>
      </div>
  );
}

// 📝 DASHBOARD
function Dashboard({ setToken }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const token = localStorage.getItem("token");

  // ✅ FIXED: function declared BEFORE useEffect
  const fetchNotes = async () => {
    const res = await fetch(`${BASE_URL}/notes`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();
    setNotes(data);
  };

  // ✅ FIXED dependency warning
  useEffect(() => {
    fetchNotes();
  }, [token]);

  const addNote = async () => {
    if (!title || !content) {
      alert("Fill all fields ⚠️");
      return;
    }

    await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    fetchNotes();
  };

  const updateNote = async (id) => {
    await fetch(`${BASE_URL}/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    });

    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    fetchNotes();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📝 Notes Vault</h1>
          <button
              className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
              onClick={logout}
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
              className="flex-1 p-2 rounded bg-gray-800"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
              className="flex-1 p-3 rounded bg-gray-800 h-28"
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
          />

          <button
              className="bg-green-500 px-4 rounded hover:bg-green-600"
              onClick={addNote}
          >
            Add
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {notes.map((note) => (
              <div key={note.id} className="bg-gray-800 p-4 rounded-lg shadow">
                {editingId === note.id ? (
                    <>
                      <input
                          className="w-full p-2 mb-2 rounded bg-gray-700"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                      />

                      <textarea
                          className="w-full p-2 rounded bg-gray-700"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                      />

                      <button
                          className="mt-2 text-green-400"
                          onClick={() => updateNote(note.id)}
                      >
                        Save
                      </button>

                      <button
                          className="ml-3 text-gray-400"
                          onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                ) : (
                    <>
                      <h3 className="font-semibold text-lg">{note.title}</h3>
                      <p className="text-gray-400">{note.content}</p>

                      <div className="flex gap-3 mt-3">
                        <button
                            className="text-blue-400 hover:text-blue-600"
                            onClick={() => {
                              setEditingId(note.id);
                              setEditTitle(note.title);
                              setEditContent(note.content);
                            }}
                        >
                          Edit
                        </button>

                        <button
                            className="text-red-400 hover:text-red-600"
                            onClick={() => deleteNote(note.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                )}
              </div>
          ))}
        </div>
      </div>
  );
}

export default App;