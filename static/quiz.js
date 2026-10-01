// ======================================================
// QUESTIONS
// ======================================================
const questions = [
  {
        question: "Which keyword is used when a JavaScript variable can change its value?",
        choices: ["const", "let", "function", "return"],
        answer: 1,
        explanation: "let is used when a variable needs to be reassigned."
    },
    {
        question: "Which JavaScript operator compares both value and type?",
        choices: ["=", "==", "===", "!="],
        answer: 2,
        explanation: "The === operator compares both value and type."
    },
    {
        question: "What is the index of the first element in a JavaScript array?",
        choices: ["0", "1", "-1", "2"],
        answer: 0,
        explanation: "JavaScript arrays are zero-indexed, so the first element has index 0."
    },
    {
        question: "Which statement is used to execute code when a condition is true?",
        choices: ["if", "for", "return", "const"],
        answer: 0,
        explanation: "The if statement executes its code block when its condition is true."
    },
    {
        question: "Which loop is commonly written with initialization, condition, and update expressions?",
        choices: ["if", "for", "switch", "return"],
        answer: 1,
        explanation: "A for loop has three parts: initialization, condition, and update."
    },
    {
        question: "Which keyword is used to define a JavaScript function?",
        choices: ["function", "object", "array", "let"],
        answer: 0,
        explanation: "The function keyword is used to define a JavaScript function."
    },
    {
        question: "What does the return statement do inside a function?",
        choices: [
            "Repeats the function",
            "Stops the function and sends a value back",
            "Creates an array",
            "Changes the function name"
        ],
        answer: 1,
        explanation: "return stops the function and sends a value back to the caller."
    },
    {
        question: "How are values commonly stored inside a JavaScript object?",
        choices: [
            "As name:value pairs",
            "As numbered loops",
            "As conditions",
            "As functions only"
        ],
        answer: 0,
        explanation: "JavaScript objects contain properties written as name:value pairs."
    },
    {
        question: "Which syntax correctly accesses the age property of a person object?",
        choices: [
            "person.age",
            "person->age",
            "person(age)",
            "person:age"
        ],
        answer: 0,
        explanation: "The dot notation object.property is used to access an object property."
    },
    {
        question: "Which JavaScript value represents true or false?",
        choices: ["string", "number", "boolean", "array"],
        answer: 2,
        explanation: "A boolean value can be either true or false."
    }
];

// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = new Array(questions.length);

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
  if (currentQuestion < questions.length - 1) {
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
  currentQuestion = questions.length - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score = 0;

    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] !== undefined) {
            if (userAnswers[i] === questions[i].answer) {
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
  let percentage = (score / questions.length) * 100;
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
function buildCorrection() {
  let correction = "";

  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.
  for (let i = 0; i < questions.length; i++) {

        let userAnswer = "Not Answered";
        let result = "Incorrect";

        if (userAnswers[i] !== undefined) {
            userAnswer = questions[i].choices[userAnswers[i]];

            if (userAnswers[i] === questions[i].answer) {
                result = "Correct";
            }
        }

        // += adds more text onto the existing correction string
        correction += `Question ${i + 1}: ${questions[i].question}

Your answer: ${userAnswer}
Correct answer: ${questions[i].choices[questions[i].answer]}
Result: ${result}
Explanation: ${questions[i].explanation}

------------------------------
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
function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

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
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
renderQuestion();
