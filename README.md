# 🤖 Interview Prep AI

**Interview Prep AI** is an AI-powered **MERN stack interview preparation platform** that helps job seekers prepare for technical interviews through **role-based question generation, personalized answers, and interactive AI mock interviews**.

Users can select their target role, generate relevant interview questions, study AI-generated answers, and practice through a simulated mock interview experience.

---

## 🚀 Features

### 🎯 Role-Based Interview Preparation

Prepare for different technical roles based on your career goals:

* Frontend Developer
* Backend Developer
* Java Developer
* Full Stack Developer
* Software Developer
* Other customizable technical roles

Questions are generated according to the selected role to make preparation more relevant.

### 🤖 AI-Powered Question Generation

The platform uses AI to dynamically generate technical interview questions based on:

* Target role
* Experience level
* Technical skills
* Interview requirements

This helps users avoid preparing from a fixed set of questions.

### 💡 AI-Generated Answers

For every generated question, users can access AI-generated answers and explanations to better understand the expected interview response.

### 🎤 AI Mock Interview

Users can take an interactive **AI-powered mock interview** that simulates a real technical interview.

The mock interview allows users to:

* Select their target role
* Start an interview session
* Answer technical questions
* Continue through multiple interview questions
* Practice real interview communication
* Receive AI-assisted feedback
* Identify areas for improvement

### 📚 Personalized Preparation

The platform provides role-specific preparation instead of generic interview questions, helping candidates focus on the technologies and concepts relevant to their target position.

### ⚡ Dynamic Content

Interview questions and answers are generated dynamically, allowing users to receive different questions and practice a wider range of concepts.

### 📱 Responsive UI

The platform provides a responsive interface for a smooth experience across desktop and mobile devices.

---

## 🧠 How It Works

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                 ┌──────────────────────┐
                 │   Select Target Role │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   AI Question       │
                 │     Generation      │
                 └──────────┬───────────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │ Study Questions │   │  Mock Interview │
        │  & AI Answers   │   │      Mode       │
        └────────┬────────┘   └────────┬────────┘
                 │                     │
                 └──────────┬──────────┘
                            ▼
                  ┌────────────────────┐
                  │ AI Feedback &      │
                  │ Interview Practice │
                  └────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* JavaScript
* HTML5
* CSS3

### Backend

* **Node.js**
* **Express.js**
* REST APIs

### Database

* **MongoDB**
* MongoDB/Mongoose for data management

### AI

* **Google Gemini API**
* AI-powered question and answer generation
* AI-assisted mock interview functionality

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────┐
│                Frontend                 │
│                 React.js                │
└───────────────────┬─────────────────────┘
                    │
                    │ REST API
                    ▼
┌─────────────────────────────────────────┐
│                Backend                  │
│            Node.js + Express            │
└───────────────┬───────────────┬─────────┘
                │               │
                ▼               ▼
       ┌────────────────┐  ┌───────────────┐
       │    MongoDB     │  │  Gemini API   │
       │    Database    │  │      AI       │
       └────────────────┘  └───────────────┘
```

---

## 📂 Project Structure

```text
Interview-Prep-AI/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

> The exact folder structure may vary depending on the project implementation.

---

## 🔄 Application Flow

### 1. Select Role

The user selects the role they want to prepare for.

Example:

```text
Frontend Developer
Backend Developer
Java Developer
Full Stack Developer
```

### 2. Generate Interview Content

The selected role and user requirements are sent to the backend.

The backend communicates with the AI service to generate relevant interview questions.

### 3. Store and Manage Data

Relevant user and interview data can be stored in MongoDB for future access and tracking.

### 4. Practice

Users can study generated questions and AI-generated answers.

### 5. Mock Interview

Users can start a simulated interview where questions are presented dynamically based on the selected role.

### 6. Feedback

The system can provide AI-assisted feedback to help users identify weaknesses and improve their interview preparation.

---

## 🎤 Mock Interview Flow

```text
Select Role
     ↓
Start Mock Interview
     ↓
AI Generates Question
     ↓
User Answers
     ↓
Next Interview Question
     ↓
Continue Interview
     ↓
Interview Completed
     ↓
AI Feedback
     ↓
Identify Weak Areas
```

---

## 🔌 API Structure

Example backend API structure:

```text
/api
│
├── /auth
│   ├── POST /register
│   └── POST /login
│
├── /interview
│   ├── POST /generate
│   ├── GET  /questions
│   └── POST /mock
│
└── /user
    ├── GET  /profile
    └── GET  /history
```

> API routes may differ depending on the current implementation.

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB
* Git

You also need a valid Gemini API key for AI-powered features.

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/interview-prep-ai.git
```

```bash
cd interview-prep-ai
```

---

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

JWT_SECRET=your_jwt_secret
```

### Environment Variables

| Variable         | Description                    |
| ---------------- | ------------------------------ |
| `PORT`           | Backend server port            |
| `MONGO_URI`      | MongoDB connection string      |
| `GEMINI_API_KEY` | Gemini API key                 |
| `JWT_SECRET`     | Secret used for authentication |

**Never commit your `.env` file to GitHub.**

---

## ▶️ Running the Project

### Start Backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

---

## 🔑 Core Functionalities

### Role-Based Question Generation

```text
Role + Experience + Skills
            ↓
        Gemini API
            ↓
Personalized Interview Questions
```

### AI Mock Interview

```text
User
 ↓
Select Role
 ↓
Start Interview
 ↓
AI Question
 ↓
User Response
 ↓
AI Evaluation
 ↓
Feedback
```

---

## 📊 Benefits

Interview Prep AI helps candidates:

* Prepare according to their target role
* Practice technical interview questions
* Understand difficult concepts through AI-generated answers
* Simulate real interview scenarios
* Identify preparation gaps
* Practice repeatedly with dynamically generated questions
* Build confidence before actual interviews

---

## 🎯 Use Cases

### Students

Students can use the platform for placement preparation and practice technical interview questions.

### Freshers

Fresh graduates can prepare for their first technical interviews using role-specific questions.

### Developers

Developers can prepare for interviews when switching jobs or targeting a new technical role.

### Job Seekers

Candidates can use AI-generated questions and mock interviews to practice before actual interviews.

---

## 🔮 Future Enhancements

The platform can be extended with:

* 🎙️ Voice-based AI interviews
* 📹 Video-based mock interviews
* 📄 Resume-based question generation
* 🏢 Company-specific interview preparation
* 📊 Interview performance analytics
* 📈 Preparation progress dashboard
* ⭐ Difficulty-based questions
* 🧠 Personalized learning recommendations
* 📝 Coding interview support
* 💬 Real-time AI interviewer
* 📚 Interview history and performance tracking

---

## 🔒 Security

The application follows common security practices such as:

* Environment variables for sensitive credentials
* Protected API keys
* Secure authentication
* Server-side validation
* Database-level data management

---

## 🤝 Contributing

Contributions are welcome!

### Steps to contribute

```bash
# Fork the repository

# Clone your fork
git clone https://github.com/your-username/interview-prep-ai.git

# Create a new branch
git checkout -b feature/new-feature

# Make your changes

# Commit changes
git add .
git commit -m "Add new feature"

# Push changes
git push origin feature/new-feature
```

Then create a Pull Request.

---

## 📸 Screenshots

Add screenshots of the application here:

```text
screenshots/
├── dashboard.png
├── questions.png
├── answers.png
├── mock-interview.png
└── feedback.png
```

Example:

```markdown
![Dashboard](./screenshots/dashboard.png)
![Mock Interview](./screenshots/mock-interview.png)
```

---

## 🌟 Project Highlights

* Full-stack **MERN application**
* AI-powered technical interview preparation
* Role-based question generation
* AI-generated interview answers
* Interactive mock interview functionality
* Dynamic interview content
* MongoDB-based data management
* RESTful backend architecture
* Scalable frontend and backend structure

---

## 👨‍💻 Author

### Deepak Dagur

Computer Science Engineering Student & AI Engineer

Building AI-powered applications focused on developer productivity, interview preparation, and intelligent software systems.

---

## ⭐ Support

If you find this project useful, consider giving the repository a **⭐ Star** on GitHub.

---

## 📄 License

This project is created for educational and portfolio purposes.
