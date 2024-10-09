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
  updateProgressBar()
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
    if (number === 3) number = 0

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
  updateProgressBar()

  const resultText = document.getElementById('resultText')
  let feedback = ''

  if (scoreTotal >= 80) {
    feedback = "Ton bien-être mental est au top ! Tu sembles gérer efficacement les défis quotidiens et maintenir un bon équilibre entre ta vie personnelle et professionnelle. <br/><b>Continue à prendre soin de toi de cette manière.</b>";
  } else if (scoreTotal >= 60) {
    feedback = "Ton bien-être mental est globalement bon, mais il peut y avoir des périodes où tu ressens un peu de stress ou de fatigue. N’hésite pas à te reposer et à consacrer du temps à des activités qui te ressourcent.";
  } else if (scoreTotal >= 40) {
    feedback = "Tu sembles éprouver des moments de fatigue mentale ou d’émotions négatives. Il pourrait être utile de revoir ton rythme quotidien et de trouver des moyens de réduire ton stress. <br/>Considère de parler à un professionnel si cela devient récurrent.";
  } else if (scoreTotal >= 20) {
    feedback = "Tu es peut-être dans une phase difficile où tu fais face à des émotions ou des pensées négatives fréquentes. Prendre soin de ta santé mentale devrait être une priorité. <br/>Envisage de demander du soutien à des proches ou des professionnels.";
  } else {
    feedback = "Ton bien-être mental semble sérieusement affecté. <br/>Il est essentiel de ne pas rester seul face à ce mal-être. <br/>Parler à un psychologue ou à un professionnel de santé pourrait t’aider à retrouver un équilibre.";
  }

  feedback += "<br/><br/><b>Tu mérite de réussir ! Tu mérite d'être heureux.se ! Ne lache rien !!</b><br/><br/><div style='border-left: 2px solid lightcoral; padding-left: 15px;'>Cette notation et conlusion concernant votre état de santé ce base sur l'étude de nombreux rapport de recherche et sondage nationale récent : <br/> <b>- Baromètre Santé 2020</b> : Les Baromètres santé sont des enquêtes périodiques, menées depuis 1992, qui visent à mieux connaître les connaissances, les attitudes, les croyances et les comportements des Français en matière de santé. <br><b>- Enquête EnClass</b> : résultats sur la santé mentale de l’enquête nationale en collèges et en lycées chez les adolescents sur la santé et les substances (EnCLASS)</div>"
  feedback += "<br/><br/><br/><i>Les données saisies sont conservés de façon totalement <b>anonyme</b>, dans un objectif de statistiques. Les rapport générés sur la base de ses données vous serons partagés sous peu !</i>"


  resultText.innerHTML = `
    Votre score est de <span class="score">${scoreTotal}</span>.<br/> ${feedback}
  `

  document.getElementById('resultContainer').style.display = 'block'
  document.getElementById('testForm').style.display = 'none'

  restartTestIcon.classList.remove('show')
  setTimeout(() => {
    restartTestIcon.style.display = 'none'
  }, 500)

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

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar')
  const progress = (currentQuestionIndex / (questions.length)) * 100
  progressBar.style.width = `${progress}%`
}

document.getElementById('startTest').addEventListener('click', function () {
  document.getElementById('testForm').style.display = 'block'
  showCurrentQuestion()
  document.getElementById('startTest').style.display = 'none'

  restartTestIcon.style.display = 'inline-block'
  setTimeout(() => {
    restartTestIcon.classList.add('show')
  }, 10)
})

function restartTest() {
  currentQuestionIndex = 0
  scoreTotal = 0

  document.getElementById('testForm').style.display = 'block'
  document.getElementById('resultContainer').style.display = 'none'

  showCurrentQuestion()

  restartTestIcon.style.display = 'inline-block'
  restartTestIcon.classList.add('show')
}

restartTestIcon.addEventListener('click', restartTest)
