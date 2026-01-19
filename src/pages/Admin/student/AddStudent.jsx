import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../config/firebase/firebase";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async () => {
    if (!name || !email || !password) {
      return alert("Please fill all fields!");
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters!");
    }

    setLoading(true);
    
    try {
      //  Get current admin email from localStorage
      const adminEmail = localStorage.getItem("userEmail");
      
      if (!adminEmail) {
        alert("Admin session not found. Please login again.");
        setLoading(false);
        return;
      }

      // Ask admin for their password (one-time)
      const adminPassword = prompt("Please enter your admin password to continue:");
      
      if (!adminPassword) {
        alert("Password required to add student!");
        setLoading(false);
        return;
      }

    
      
      //  Create student account (this will logout admin temporarily)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const user = userCredential.user;
      console.log(" Student created:", user.uid);

 
      
      // Save student to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        email,
        role: "student",
        createdAt: new Date(),
        isActive: true,
      });
      
  
      
      // Re-login the admin immediately
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      
      // console.log("Admin re-logged in successfully!");

      alert(" Student added successfully!");
      
      // Clear form
      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      // console.error(" Error:", error);
      
      if (error.code === "auth/email-already-in-use") {
        alert(" This email is already registered!");
      } else if (error.code === "auth/weak-password") {
        alert(" Password should be at least 6 characters!");
      } else if (error.code === "auth/invalid-email") {
        alert(" Invalid email address!");
      } else if (error.code === "auth/wrong-password") {
        alert(" Wrong admin password! Please try again.");
      } else {
        alert(" Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        Add New Student
      </h2>
      
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
        <p className="text-yellow-800">
           <strong>Note:</strong> You'll be asked to enter your admin password when adding a student.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Student Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter student name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            placeholder="student@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Password (min 6 characters)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter password"
          />
        </div>
        <button
          onClick={handleAddStudent}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Student..." : "Add Student"}
        </button>
      </div>

    
    </div>
  );
};

export default AddStudent;