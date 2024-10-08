import { questions } from './ask.js'
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'

const firebaseConfig = {
  apiKey: "AIzaSyBJtO6JbDe5woJiRRmtGIvOyS6WGn2zelk",
  authDomain: "innercheck-38bbf.firebaseapp.com",
  projectId: "innercheck-38bbf",
  storageBucket: "innercheck-38bbf.appspot.com",
  messagingSenderId: "333525932016",
  appId: "1:333525932016:web:f3bafb1cfbcae01502af35"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

let currentQuestionIndex = 0
let scoreTotal = 0
let number = 0

function showCurrentQuestion() {
  const questionContainer = document.getElementById('questionContainer')
  const questionData = questions[currentQuestionIndex]

  questionContainer.innerHTML = ''

  const questionLabel = document.createElement('label')
  questionLabel.textContent = questionData.question
  questionContainer.appendChild(questionLabel)

  questionData.reponses.forEach((reponse, index) => {
    const radioInput = document.createElement('input')
    radioInput.type = 'radio'
    radioInput.id = `reponse${index}`
    radioInput.name = `question${questionData.id}`
    radioInput.value = reponse.valeur

    const radioLabel = document.createElement('label')
    radioLabel.setAttribute('for', `reponse${index}`)
    radioLabel.textContent = reponse.texte
    radioLabel.className = 'radio' + number++
    if(number === 3) { number = 0 }

    questionContainer.appendChild(radioInput)
    questionContainer.appendChild(radioLabel)
    questionContainer.appendChild(document.createElement('br'))

    radioInput.addEventListener('click', handleAnswer)
  })
}

function handleAnswer(event) {
  const userAnswerValue = parseInt(event.target.value)
  const currentQuestion = questions[currentQuestionIndex]

  scoreTotal += currentQuestion.poids * userAnswerValue

  currentQuestionIndex++
  if (currentQuestionIndex < questions.length) {
    showCurrentQuestion()
  } else {
    displayResults()
  }
}

function displayResults() {
  const resultText = document.getElementById('resultText')
  let feedback = ''

  if (scoreTotal >= 20) {
    feedback = "Votre état est excellent !"
  } else if (scoreTotal >= 0) {
    feedback = "Vous allez bien, mais restez vigilant."
  } else {
    feedback = "Il serait bon de consulter un professionnel."
  }

  resultText.innerHTML = `
    Votre score est de ${scoreTotal}. ${feedback}
  `

  document.getElementById('resultContainer').style.display = 'block'
  document.getElementById('testForm').style.display = 'none'

  restartTestIcon.classList.remove('show');
  setTimeout(() => {
    restartTestIcon.style.display = 'none'; 
  }, 500); 

  saveResultsToFirebase()
}

async function saveResultsToFirebase() {
  const resultData = {
    scoreTotal: scoreTotal,
    totalQuestions: questions.length,
    date: new Date().toISOString()
  }

  try {
    await addDoc(collection(db, 'results'), resultData)
    console.log("Les résultats ont été enregistrés dans Firestore.")
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des résultats : ", error)
  }
}

document.getElementById('startTest').addEventListener('click', function () {
  document.getElementById('testForm').style.display = 'block'
  showCurrentQuestion()
  document.getElementById('startTest').style.display = 'none'

  restartTestIcon.style.display = 'inline-block'; 
  setTimeout(() => {
    restartTestIcon.classList.add('show'); 
  }, 10); 
})

function restartTest() {
  currentQuestionIndex = 0;
  scoreTotal = 0;

  document.getElementById('testForm').style.display = 'block';
  document.getElementById('resultContainer').style.display = 'none';

  showCurrentQuestion();

  restartTestIcon.style.display = 'inline-block';
  restartTestIcon.classList.add('show');
}

restartTestIcon.addEventListener('click', restartTest);
