import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "babatunde3891",
  port: 5432,
});

const app = express();
const port = 3000;

db.connect();


let quiz = [];
db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
  }
  db.end();
});

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



//   OR this down codes   /////
// Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// // Set EJS as view engine
// app.set("view engine", "ejs");

// let quiz = [];
// let totalCorrect = 0;
// let currentQuestion = {};

// // Connect to the database
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.message);
//     return;
//   }
//   console.log("Connected to the database");
//   loadQuiz();
// });

// function loadQuiz() {
//   db.query("SELECT * FROM capitals", (err, res) => {
//     if (err) {
//       console.error("Error executing query", err.stack);
//       return;
//     }
//     quiz = res.rows;
//     console.log("Quiz loaded successfully");
//   });
// }

// // GET home page
// app.get("/", (req, res) => {
//   totalCorrect = 0;
//   nextQuestion();
//   res.render("index", { question: currentQuestion });
// });

// // POST a new post
// app.post("/submit", (req, res) => {
//   const answer = req.body.answer.trim().toLowerCase();
//   let isCorrect = false;
//   if (currentQuestion.capital.toLowerCase() === answer) {
//     totalCorrect++;
//     console.log(totalCorrect);
//     isCorrect = true;
//   }

//   nextQuestion();
//   res.render("index", {
//     question: currentQuestion,
//     wasCorrect: isCorrect,
//     totalScore: totalCorrect,
//   });
// });

// function nextQuestion() {
//   currentQuestion = quiz[Math.floor(Math.random() * quiz.length)];
// }

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });