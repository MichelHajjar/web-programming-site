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

let currentQuestion = 0;
const userAnswers = new Array(questions.length);

const letters = ["A", "B", "C", "D"];

// Disable First/Previous on the first question and Next/Last on the last one
function updateButtons() {
    let atStart = currentQuestion === 0;
    let atEnd = currentQuestion === questions.length - 1;

    document.getElementById("firstBtn").disabled = atStart;
    document.getElementById("previousBtn").disabled = atStart;
    document.getElementById("nextBtn").disabled = atEnd;
    document.getElementById("lastBtn").disabled = atEnd;
}

// Display the current question
function displayQuestion() {
    let question = questions[currentQuestion];

    document.getElementById("progress").textContent =
        "Question " + (currentQuestion + 1) + " of " + questions.length;

    document.getElementById("questionText").textContent =
        question.question;

    let choices = document.getElementById("choices");
    choices.innerHTML = "";

    for (let i = 0; i < question.choices.length; i++) {
        // The whole card is a <label>, so clicking anywhere on it selects the radio
        let card = document.createElement("label");
        card.className = "choice";

        let radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "choice";
        radio.value = i;

        // Re-select the choice the user already picked for this question
        if (userAnswers[currentQuestion] === i) {
            radio.checked = true;
            card.classList.add("selected");
        }

        radio.onchange = function () {
            saveAnswer(i);
            displayQuestion();
        };

        let text = document.createElement("span");
        text.textContent = letters[i] + ". " + question.choices[i];

        card.appendChild(radio);
        card.appendChild(text);
        choices.appendChild(card);
    }

    updateButtons();
}

function saveAnswer(choiceIndex) {
    userAnswers[currentQuestion] = choiceIndex;
}

function goNext() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion = currentQuestion + 1;
        displayQuestion();
    }
}

function goPrevious() {
    if (currentQuestion > 0) {
        currentQuestion = currentQuestion - 1;
        displayQuestion();
    }
}

function goFirst() {
    currentQuestion = 0;
    displayQuestion();
}

function goLast() {
    currentQuestion = questions.length - 1;
    displayQuestion();
}

function calculateScore() {
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

function calculatePercentage(score) {
    let percentage = (score / questions.length) * 100;
    let remainder = percentage % 1;

    if (remainder >= 0.5) {
        percentage = percentage + (1 - remainder);
    } else {
        percentage = percentage - remainder;
    }

    return percentage;
}

function getPerformanceMessage(percentage) {
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

function buildCorrection() {
    let correction = "";

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

// Show the results on the page (this function was missing before)
function showResults(score, percentage, message, correction) {
    document.getElementById("scoreText").textContent =
        "Score: " + score + " / " + questions.length;

    document.getElementById("percentageText").textContent =
        "Percentage: " + percentage + "%";

    document.getElementById("performanceText").textContent =
        "Result: " + message;

    document.getElementById("correction").textContent = correction;

    document.getElementById("quizPanel").style.display = "none";
    document.getElementById("resultsPanel").style.display = "block";
}

function submitQuiz() {
    let score = calculateScore();
    let percentage = calculatePercentage(score);
    let message = getPerformanceMessage(percentage);
    let correction = buildCorrection();

    showResults(score, percentage, message, correction);
}

// Show the first question as soon as the page is ready
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("resultsPanel").style.display = "none";
    displayQuestion();
});