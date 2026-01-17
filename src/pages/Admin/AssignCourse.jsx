// src/pages/Admin/AssignCourse.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const AssignCourse = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("");

  // Fetch students from "users" collection where role === "student"
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const studentList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.role === "student"); // ✅ only students
        setStudents(studentList);
      } catch (err) {
        console.log("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, []);

  // Fetch courses from "courses" collection
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const courseList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      } catch (err) {
        console.log("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleAssign = async () => {
    if (!student || !course) {
      alert("Please select both student and course");
      return;
    }

    try {
      const selectedStudent = students.find(s => s.id === student);
      const selectedCourse = courses.find(c => c.id === course);

      await addDoc(collection(db, "enrollments"), {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        studentEmail: selectedStudent.email,
        courseId: selectedCourse.id,
        courseName: selectedCourse.name, // assuming course field is "name"
        assignedAt: new Date(),
      });

      alert("Course assigned successfully!");
      setStudent("");
      setCourse("");
    } catch (err) {
      console.log("Error assigning course:", err);
      alert("Failed to assign course");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Assign Course to Student</h2>

      {/* Student Dropdown */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Select Student:</label>
        <select
          value={student}
          onChange={e => setStudent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Select Student --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Course Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Select Course:</label>
        <select
          value={course}
          onChange={e => setCourse(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Select Course --</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition"
      >
        Assign Course
      </button>
    </div>
  );
};

export default AssignCourse;
