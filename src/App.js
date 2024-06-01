import './App.css';
import { useEffect } from 'react';
import {Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from './pages/VerifyEmail';
import { getUserDetails } from "./services/operations/profileAPI";
import { ACCOUNT_TYPE } from "./utils/contants";

import OpenRoute from "./components/core/Auth/OpenRoute";
import Navbar from "./components/common/Navbar";
import About from "./pages/About";
import Catalog from './pages/Catalog';
import Contact from "./pages/Contact";
import Dashboard from './pages/Dashboard';
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import MyProfile from "./components/core/Dashboard/MyProfile"
import Settings from './components/core/Dashboard/settings';
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from './components/core/Dashboard/Cart';
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor';
import AddCourse from './components/core/Dashboard/AddCourses';
import MyCourses from "./components/core/Dashboard/MyCourses";
// import EditCourse from './components/core/Dashboard/EditCourse';
import CourseDetails from './pages/CourseDetails'

function App() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const token = JSON.parse(localStorage.getItem('token'))
      dispatch(getUserDetails(token, navigate))
    }
  }, [])

  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/about' element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='catalog/:catalogName' element={<Catalog/>} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />

        <Route path="signup" element={
          <OpenRoute>
            <Signup/>
          </OpenRoute>
        }
        />

        <Route path="login" element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        {/* Private Route - for Only Logged in User */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >

          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
          
          {/* Route only for Instructors */}
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />
                {/* <Route
                  path="dashboard/edit-course/:courseId"
                  element={<EditCourse />}
                /> */}
              </>
            )
          }
          
          
          {/* Route only for Students */}
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="dashboard/enrolled-courses"
                  element={<EnrolledCourses />}
                />
                <Route path="/dashboard/cart" element={<Cart/>} />
              </>
            )
          }

          <Route path="dashboard/settings" element={<Settings />} />
        </Route>


      </Routes>
    </div>
  );
}

export default App;
