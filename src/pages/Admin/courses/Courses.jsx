// src/pages/Admin/courses/Courses.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase/firebase";
import Sidebar from "../../../components/Navbar";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const courseList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          All Courses
        </h1>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-600">Loading courses...</p>
        )}

        {/* EMPTY STATE */}
        {!loading && courses.length === 0 && (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <p className="text-gray-600 text-lg">
              No courses found. Please add a course.
            </p>
          </div>
        )}

        {/* COURSES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-t-4 border-green-600"
            >
              {/* HEADER */}
              <div className="mb-4">
                <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full mb-2">
                  {course.category}
                </span>

                <h2 className="text-xl font-bold text-gray-800">
                  {course.name}
                </h2>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-600 text-sm mb-4">
                {course.description.length > 120
                  ? course.description.substring(0, 120) + "..."
                  : course.description}
              </p>

              {/* INFO */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>⏱ {course.duration}</span>
                <span className="capitalize">
                  {course.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                </span>
              </div>

              {/* FOOTER */}
              <div className="text-xs text-gray-400">
                Added on:{" "}
                {course.createdAt
                  ? new Date(course.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
