const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory database
let courses = [];

// Course entity
class Course {
  constructor(id, name, subject, chapters, type, learnMode) {
    this.id = id;
    this.name = name;
    this.subject = subject;
    this.chapters = chapters;
    this.type = type;
    this.learnMode = learnMode;
  }
}

// Create a new course
app.post('/course/create', (req, res) => {
  const { name, subject, chapters, type, learnMode } = req.body;
  const id = courses.length + 1;
  const newCourse = new Course(id, name, subject, chapters, type, learnMode);
  courses.push(newCourse);
  res.json({ message: 'Course created successfully', course: newCourse });
});

// Update an existing course
app.put('/course/update/:id', (req, res) => {
  const courseId = req.params.id;
  const { name, subject, chapters, type, learnMode } = req.body;
  const courseIndex = courses.findIndex(course => course.id === parseInt(courseId));
  if (courseIndex !== -1) {
    courses[courseIndex] = { ...courses[courseIndex], name, subject, chapters, type, learnMode };
    res.json({ message: 'Course updated successfully', course: courses[courseIndex] });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

// Get all courses
app.get('/course/get', (req, res) => {
  const userType = req.query.userType; // userType should be 'student' or 'courseDeveloper'

  if (userType === 'student') {
    const studentCourses = courses.map(course => ({ id: course.id, name: course.name, subject: course.subject }));
    res.json({ courses: studentCourses });
  } else if (userType === 'courseDeveloper') {
    res.json({ courses });
  } else {
    res.status(400).json({ message: 'Invalid userType. Please provide either "student" or "courseDeveloper"' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
