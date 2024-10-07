console.log('JS SUCCESSFULLY LOAD !')

let currentQuestionIndex = 0
let scoreTotal = 100
let yesCount = 0
let noCount = 0
let correctAnswersCount = 0
let incorrectAnswersCount = 0

function showCurrentQuestion() {
  const questionContainer = document.getElementById('questionContainer')
  const questionData = questions[currentQuestionIndex]

  questionContainer.innerHTML = ''

  const questionLabel = document.createElement('label')
  questionLabel.textContent = questionData.question
  questionLabel.setAttribute('for', `question${questionData.id}`)

  const yesLabel = document.createElement('label')
  yesLabel.textContent = ' Oui '
  yesLabel.setAttribute('for', `yes${questionData.id}`)
  yesLabel.className = 'yes'

  const yesInput = document.createElement('input')
  yesInput.type = 'radio'
  yesInput.id = `yes${questionData.id}`
  yesInput.name = `question${questionData.id}`
  yesInput.value = 'yes'
  yesInput.className = 'yes'

  const noLabel = document.createElement('label')
  noLabel.textContent = ' Non '
  noLabel.setAttribute('for', `no${questionData.id}`)
  noLabel.className = 'no'

  const noInput = document.createElement('input')
  noInput.type = 'radio'
  noInput.id = `no${questionData.id}`
  noInput.name = `question${questionData.id}`
  noInput.value = 'no'
  noInput.className = 'no'


  questionContainer.appendChild(questionLabel)
  questionContainer.appendChild(yesInput)
  questionContainer.appendChild(yesLabel)
  questionContainer.appendChild(noInput)
  questionContainer.appendChild(noLabel)

  yesInput.addEventListener('click', handleAnswer)
  noInput.addEventListener('click', handleAnswer)
}

function updateScore(userAnswer) {
  const currentQuestion = questions[currentQuestionIndex]

  if (userAnswer === 'yes') {
    yesCount++
  } else {
    noCount++
  }

  if (userAnswer === currentQuestion.correctAnswer) {
    correctAnswersCount++
  } else {
    incorrectAnswersCount++
    scoreTotal -= currentQuestion.poids
  }
}

function handleAnswer(event) {
  const userAnswer = event.target.value
  updateScore(userAnswer)

  currentQuestionIndex++
  if (currentQuestionIndex < questions.length) {
    showCurrentQuestion()
  } else {
    displayResults()
  }
}

function displayResults() {
  const resultText = document.getElementById('resultText')
  const totalQuestions = questions.length
  const percentageYes = ((yesCount / totalQuestions) * 100).toFixed(2)
  const percentageNo = ((noCount / totalQuestions) * 100).toFixed(2)
  const percentageCorrect = ((correctAnswersCount / totalQuestions) * 100).toFixed(2)

  let feedback = ''

  if (scoreTotal >= 86) {
    feedback = "Votre santé mentale semble excellente. Continuez ainsi!"
  } else if (scoreTotal >= 61) {
    feedback = "Votre santé mentale est globalement bonne, mais il est important de rester vigilant."
  } else if (scoreTotal >= 31) {
    feedback = "Vous avez quelques préoccupations concernant votre santé mentale. Pensez à en parler à un professionnel."
  } else {
    feedback = "Votre santé mentale montre des signes de détresse. Il est recommandé de consulter un spécialiste."
  }

  resultText.innerHTML = `
    Votre score est de ${scoreTotal}. ${feedback} <br><br>
    <strong>Statistiques :</strong> <br>
    Nombre de réponses "Oui" : ${yesCount} (${percentageYes}%) <br>
    Nombre de réponses "Non" : ${noCount} (${percentageNo}%) <br>
    Nombre total de questions : ${totalQuestions} <br>
    Réponses correctes : ${correctAnswersCount} (${percentageCorrect}%) <br>
    Réponses incorrectes : ${incorrectAnswersCount}<br>
    Score finale : ${scoreTotal}
  `
  document.getElementById('resultContainer').style.display = 'block'
  document.getElementById('testForm').style.display = 'none'
}

document.getElementById('startTest').addEventListener('click', function() {
  document.getElementById('testForm').style.display = 'block'
  showCurrentQuestion()
  document.getElementById('startTest').style.display = 'none'
})
