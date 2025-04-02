import axios from "axios";
const API_URL = "http://localhost:3001/api";

export const fetchNotes = async () => {
  const response = await fetch(`${API_URL}/notes`);
  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }
  return response.json();
};

export const createNote = async (note) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
      'id': localStorage.getItem("Id"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to create note");
  }
  return response.json();
};

export const updateNote = async (id, note) => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
     'Authorization': `Bearer ${localStorage.getItem("token")}`,
      'id': localStorage.getItem("Id"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to update note");
  }
  return response.json();
};

export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
       'id': localStorage.getItem("Id"),
       "Content-Type": "application/json",
     },
  });

  if (!response.ok) {
    throw new Error("Failed to delete note");
  }
  return true;
};

// login api's

export const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
     'id': localStorage.getItem("Id"),
     "Content-Type": "application/json",
   },
});

// Add response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized response
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      // Redirect to login if needed
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
