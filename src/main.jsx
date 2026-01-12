import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { store } from './config/redux/store/store'
import { Provider} from 'react-redux'


createRoot(document.getElementById('root')).render(

        <Provider store={store}>
                
                <BrowserRouter>
                                <Navbar
                                />
                        <Routes>
                                {/* Public */}
                                <Route path='login' element={<Login />} />
                                {/* Protected Route */}

                                {/* PROTECTED */}
                                <Route
                                        index
                                        element={<ProtectedRoutes component={<Dashboard />} role={['Admin']} />}
                                />

                                <Route
                                        path="students"
                                        element={<ProtectedRoutes component={<Student />} role={['Admin']} />}
                                />

                                <Route
                                        path="students/dashboard"
                                        element={<ProtectedRoutes component={<StudentDashboard />} role={['Admin']} />}
                                />

                                <Route
                                        path="students/add"
                                        element={<ProtectedRoutes component={<AddStudent />} role={['Admin']} />}
                                />

                                <Route
                                        path="courses"
                                        element={<ProtectedRoutes component={<Courses />} role={['Admin']} />}
                                />

                                <Route
                                        path="courses/add"
                                        element={<ProtectedRoutes component={<AddCourse />} role={['Admin']} />}
                                />

                                <Route
                                        path="assign-course"
                                        element={<ProtectedRoutes component={<AssignCourse />} role={['Admin']} />}
                                />

                                <Route
                                        path="my-courses"
                                        element={<ProtectedRoutes component={<MyCourse />} role={['Student']} />}
                                />

                                <Route
                                        path="profile"
                                        element={<ProtectedRoutes component={<Profile />} role={['Student']} />}
                                />


                        </Routes>
                </BrowserRouter>
        </Provider>
)