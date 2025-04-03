import axios from "axios";
const API_URL = "http://localhost:3001/api";



export const fetchNotes = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/notes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${await response.text()}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Notes Error:", error.message);
    throw error;
  }
};


export const createNote = async (note) => {
  const id = localStorage.getItem("id")
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
      'id': id,
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
  if (!id) throw new Error("Note ID is required");

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
    const errorMessage = `Failed to update note: ${response.status} ${await response.text()}`;
    throw new Error(errorMessage);
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


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
  
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
