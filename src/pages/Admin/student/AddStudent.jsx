// src/pages/Admin/student/AddStudent.jsx
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../config/firebase/firebase";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAddStudent = async () => {
    if (!name) return alert("Please fill Name");
    if (!email) return alert("Please fill Email");
    if (!password) return alert("Please fill Password");

    try {
      // ✅ Firestore auto-generate document ID
      await addDoc(collection(db, "users"), {
        name,
        email,
        password, // ⚠️ demo only — real app mein hash karna
        role: "student",
        createdAt: new Date(),
      });

      alert("Student added successfully!");

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Failed to add student");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Add New Student
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Student Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <button
        onClick={handleAddStudent}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
      >
        Add Student
      </button>
    </div>
  );
};

export default AddStudent;
