import { questions } from './ask.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';

const firebaseConfig = {
  apiKey: "AIzaSyBJtO6JbDe5woJiRRmtGIvOyS6WGn2zelk",
  authDomain: "innercheck-38bbf.firebaseapp.com",
  projectId: "innercheck-38bbf",
  storageBucket: "innercheck-38bbf.appspot.com",
  messagingSenderId: "333525932016",
  appId: "1:333525932016:web:f3bafb1cfbcae01502af35"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentQuestionIndex = 0;
let scoreTotal = 0;
let number = 0;

function showCurrentQuestion() {
  updateProgressBar();
  const questionContainer = document.getElementById('questionContainer');
  const questionData = questions[currentQuestionIndex];

  questionContainer.innerHTML = '';

  const questionLabel = document.createElement('label');
  questionLabel.textContent = questionData.question;
  questionContainer.appendChild(questionLabel);

  questionData.reponses.forEach((reponse, index) => {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.id = `reponse${index}`;
    radioInput.name = `question${questionData.id}`;
    radioInput.value = reponse.valeur;

    const radioLabel = document.createElement('label');
    radioLabel.setAttribute('for', `reponse${index}`);
    radioLabel.textContent = reponse.texte;
    radioLabel.className = 'radio' + number++;
    if (number === 3) number = 0;

    questionContainer.appendChild(radioInput);
    questionContainer.appendChild(radioLabel);
    questionContainer.appendChild(document.createElement('br'));

    radioInput.addEventListener('click', handleAnswer);
  });
}

function handleAnswer(event) {
  const userAnswerValue = parseInt(event.target.value);
  const currentQuestion = questions[currentQuestionIndex];

  scoreTotal += currentQuestion.poids * userAnswerValue;

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showCurrentQuestion();
  } else {
    displayResults();
  }
}

function displayResults() {
  updateProgressBar();

  const resultText = document.getElementById('resultText');
  let feedback = '';

  if (scoreTotal >= 80) {
    feedback = "Ton bien-être mental est au top !";
  } else if (scoreTotal >= 60) {
    feedback = "Ton bien-être mental est globalement bon.";
  } else if (scoreTotal >= 40) {
    feedback = "Tu sembles éprouver des moments de fatigue mentale.";
  } else if (scoreTotal >= 20) {
    feedback = "Tu es peut-être dans une phase difficile.";
  } else {
    feedback = "Ton bien-être mental semble sérieusement affecté.";
  }

  resultText.innerHTML = `Votre score est de ${scoreTotal}. ${feedback}`;
  document.getElementById('resultContainer').style.display = 'block';
  document.getElementById('testForm').style.display = 'none';
}

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  const progress = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

document.getElementById('startTest').addEventListener('click', function () {
  document.getElementById('testForm').style.display = 'block';
  showCurrentQuestion();
  document.getElementById('startTest').style.display = 'none';
});

// Accessibility feature
let accessibilityMode = false;

document.getElementById('accessibilityBtn').addEventListener('click', function () {
  accessibilityMode = !accessibilityMode;

  if (accessibilityMode) {
    document.body.style.backgroundColor = '#000';
    document.body.style.color = '#FFF';
    document.body.style.fontSize = '1.5em';

    const radios = document.querySelectorAll('.radio0, .radio1, .radio2');
    radios.forEach(radio => {
      radio.style.backgroundColor = '#111';
      radio.style.color = '#FFF';
      radio.style.border = '2px solid #FFF';
    });

    document.getElementById('progressBar').style.backgroundColor = '#FFD700';
  } else {
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
    document.body.style.fontSize = '';

    const radios = document.querySelectorAll('.radio0, .radio1, .radio2');
    radios.forEach(radio => {
      radio.style.backgroundColor = '';
      radio.style.color = '';
      radio.style.border = '';
    });

    document.getElementById('progressBar').style.backgroundColor = '#88e28b';
  }
});
