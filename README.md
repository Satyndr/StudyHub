# StudyNotion
StudyNotion is an ED Tech (Educational Technology) web application developed using MERN stack.

## Features
- User Authentication: StudyNotion provides secure user registration and authentication using JWT (JSON Web Tokens). Users can sign up, log in, and manage their profiles with ease.
- Courses by Instructor: Instructors can create and edit created courses.
- Courses for students: Students can enroll in courses, access course materials, and track their progress.
- Progress Tracking: Study Notion allows students to track their progress in enrolled courses. They can view completed lessons, scores on quizzes and assignments, and overall course progress.
- Payment Integration: Study Notion integrates with Razorpay for payment processing. Users can make secure payments for course enrollment and other services using various payment methods supported by Razorpay.(Currently turned off this feature to access course freely to everyone)
- Instructor Dashboard: Instructors have access to a comprehensive dashboard to view information about their courses, students, and income. The dashboard provides charts and visualizations to present data clearly and intuitively. Instructors can monitor the total number of students enrolled in each course, track course performance, and view their income generated from course sales.
- Categories: Courses can fetch courses according to the category of Course.

## Tech Stack, Libraries and Frameworks
- React
- Tailwind
- Javascript
- MongoDB Atlas (Database)
- NodeJS
- ExpressJS

## Screenshots
![HomePage](https://res.cloudinary.com/dn0zp2foz/image/upload/v1717435985/Github%20readme%20images/StudyNotion/jxtmynog1rh7eqdarmbi.png)
![SignUp](https://res.cloudinary.com/dn0zp2foz/image/upload/v1717435985/Github%20readme%20images/StudyNotion/bnah0wtgtg90t9rvqemo.png)
![AboutUs](https://res.cloudinary.com/dn0zp2foz/image/upload/v1717435984/Github%20readme%20images/StudyNotion/dshfxv5buapsv8nlqjes.png)
![catalog](https://res.cloudinary.com/dn0zp2foz/image/upload/v1717435984/Github%20readme%20images/StudyNotion/d2abmfxqylvxxdixmxpv.png)
![instructorCourses](https://res.cloudinary.com/dn0zp2foz/image/upload/v1717435984/Github%20readme%20images/StudyNotion/degnatx3juefmn3xpybb.png)
![courseView](https://res.cloudinary.com/dn0zp2foz/image/upload/v1717436557/Github%20readme%20images/StudyNotion/cxbum5ur6wdlyru24cyi.png)
![Lecture](https://res.cloudinary.com/dn0zp2foz/image/upload/v1717435984/Github%20readme%20images/StudyNotion/nv66sykie8zpalvcgbax.png)

## Useful information about project
- Backend is in the server folder.
- Before uploading courses and anything create the categories e.g. web dev, Python, etc. (without categories courses cannot be added). You can add categories though create category API [{YOUR_LOCAL_ADDRESS}/api/v1/course/createCategory]() using Postman or Hoppscotch.
  ![postman screenshot](https://res.cloudinary.com/dn0zp2foz/image/upload/v1717436892/Github%20readme%20images/StudyNotion/nncx5zzi1o5c0l0mkp10.png)
- Categories can directly be added to the database.

## Installation

1. Clone the repository to your local machine.
   ```
   git clone https://github.com/himanshu8443/Study-Notion-master.git
   ```
2. Install the required packages.
   ```
   cd Study-Notion-master
   npm install
   
   cd server
   npm install
   ```

3. Set up the environment variables: Create a .env file in the root directory and /server Add the required environment variables, such as database connection details, JWT secret, and any other necessary configurations check .env.example files for more info.
     For root folder add these values in .env
     ```
     REACT_APP_BASE_URL = {YOUR_LOCAL_ADDRESS}/api/v1
     ```
     Add these values in .env inside server folder
     ```
     MAIL_HOST = smtp.gmail.com
    MAIL_USER = {Your_mail}
    MAIL_PASS = {Your_mail_password}
    
    JWT_SECRET = {add_secretKey_yourself}
    FOLDER_NAME = "StudyNotion"
    
    RAZORPAY_KEY = {Razorpay_key}(not neccessary for this code)
    RAZORPAY_SECRET = {Razorpay_Secret}(not neccessary for this code)
    
    CLOUD_NAME = {Cloudinary_id_name}
    API_KEY = {Cloudinary_api_key}
    API_SECRET = {Cloudinary_api_secret}
    
    MONGODB_URL={Mongodb_atlas_url}
    
    PORT = 4000
    
    ORIGIN = {local_address) or {live_frontend_address}
     ```
4. Start the development server.
   ```
   npm run dev
   ```

