// ======================================================
// QUESTIONS
// ======================================================
let total = 0; // how many questions (from the server) 
const cache = {}; // cache[i] = a fetched question object

async function getQuestion(index) {
// 1. If this question is already in cache, return the cached copy
// 2. Otherwise fetch it from `/api/question/${index}` (relative URL)
// 3. Check response.ok; if the request failed, throw an error
// 4. Read the JSON, store it in cache[index], and return it
try {
    if (cache[index] !== undefined) {
        return cache[index];
    }
    const response = await fetch(`/api/question/${index}`); 

    if (!response.ok) {
    throw new Error("HTTP " + response.status);
    }

    const data = await response.json(); // parse the JSON (also async)
    cache[index] = data; // store the question in cache
    return data;
    } 
    catch (error) {
    console.log("Could not load question:", error.message); 
    throw error; // rethrow the error to be handled by the caller
    }
}

// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = [];

// ======================================================
// SAVE AN ANSWER
// ======================================================
function saveAnswer(choiceIndex) {
    userAnswers[currentQuestion] = choiceIndex;
}

// ======================================================
// NAVIGATION
// ======================================================
function goNext() {
  //   Move to the next question if not at the last question.
  if (currentQuestion < total - 1) {
        currentQuestion = currentQuestion + 1;
        renderQuestion();
    }
}

function goPrevious() {
  //   Move to the previous question if not at the first question.
  if (currentQuestion > 0) {
        currentQuestion = currentQuestion - 1;
        renderQuestion();
    }
}

function goFirst() {
  //   Move to the first question.
  currentQuestion = 0;
    renderQuestion();
}
function goLast() {
  //   Move to the last question.
  currentQuestion = total - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
async function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score = 0;

    for (let i = 0; i < total; i++) {
        if (userAnswers[i] !== undefined) {
            const q = await getQuestion(i);//return a promise , it waits until we receive the question object from the server before continuing
            if (userAnswers[i] === q.answer) {
                score = score + 1;
            }
        }
    }
    return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  //   Calculate the percentage score based on the total number of questions.
  let percentage = (score / total) * 100;
    let remainder = percentage % 1;

    if (remainder >= 0.5) {
        percentage = percentage + (1 - remainder);
    } else {
        percentage = percentage - remainder;
    }

    return percentage;
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
  //   Return a performance message based on the percentage score.
  if (percentage >= 80) {
        return "Excellent";
    } else if (percentage >= 60) {
        return "Good";
    } else if (percentage >= 50) {
        return "Pass";
    } else {
        return "Needs improvement";
    }
}

// ======================================================
// BUILD CORRECTION
// ======================================================
async function buildCorrection() {
  let correction = "";

  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.
  for (let i = 0; i < total; i++) {
        const q = await getQuestion(i);
        let userAnswer = "Not Answered";
        let result = "Incorrect";

        if (userAnswers[i] !== undefined) {
            userAnswer = q.choices[userAnswers[i]];

            if (userAnswers[i] === q.answer) {
                result = "Correct";
            }
        }

        // += :correction = correction + newText;
        // the back ticks allows multiline strings and to Insert JavaScript values inside the string using ${...}
        correction += `Question ${i + 1}: ${q.question}

Your answer: ${userAnswer}
Correct answer: ${q.choices[q.answer]}
Result: ${result}
Explanation: ${q.explanation}

`;
    }
  return correction;
}

// ======================================================
// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.
// ======================================================

// ======================================================
// SUBMIT QUIZ
// ======================================================
async function submitQuiz() {
  const score = await calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = await buildCorrection();
  showResults(score, percentage, message, correction);
}

async function renderQuestion() {
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");
    loading.hidden = false;
    error.hidden = true;
    error.textContent = "";

    try {
        const q = await getQuestion(currentQuestion); 

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${total}`;

  // --------------------------------------------------
  // QUESTION
  // --------------------------------------------------
  document.getElementById("questionText").textContent = q.question;

  // --------------------------------------------------
  // CHOICES
  // --------------------------------------------------
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;
    // Restore an answer previously selected
    // by the user.
    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }
    // When the user selects this answer,
    // save its index.
    radio.onclick = function () {
      saveAnswer(i);
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + q.choices[i]));
    choicesContainer.appendChild(label);
  }

  // --------------------------------------------------
  // NAVIGATION BUTTONS
  // --------------------------------------------------
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled =
    currentQuestion === total - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === total - 1;
} catch (err) {
    error.textContent = "Could not load question: " + err.message;
    error.hidden = false;
} finally {
    loading.hidden = true;
}
}


// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${total}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
async function init() { // Async because we will use await to fetch data from the server
// 1. Fetch the question count from "/api/questions/count"
// 2. Check response.ok; if the request failed, throw an error
// 3. Read the JSON and set total to the count
// 4. await renderQuestion() to show the first question
const loading = document.getElementById("loading");// Get the loading message from HTML
const errorElement = document.getElementById("error"); // Get the error message element from HTML
loading.hidden = false;// Show "Loading..."
errorElement.hidden = true;// Hide any previous error message
    try { // Try to fetch the total number of questions
         const response = await fetch("/api/questions/count");// Request the number of questions from the server
         if (!response.ok) { // Check if the HTTP request failed
             throw new Error("HTTP " + response.status);
         }
         const data = await response.json();// Convert the JSON response into a JavaScript object
         total = data.count;// Store the total number of questions

         await renderQuestion();// Fetch and display the first question

    } catch (error) {
         errorElement.textContent = "Could not load quiz: " + error.message;
         errorElement.hidden = false;

    } finally {// Always execute, whether the request succeeds or fails
         loading.hidden = true;// Hide "Loading..." when finished
    }
}
init();// Call the function to start the live quiz