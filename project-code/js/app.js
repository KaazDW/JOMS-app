console.log('JS SUCCESSFULLY LOAD !');

let currentQuestionIndex = 0;
let scoreTotal = 100;

function showCurrentQuestion() {
  const questionContainer = document.getElementById('questionContainer');
  const questionData = questions[currentQuestionIndex];

  questionContainer.innerHTML = ''; 

  const questionLabel = document.createElement('label');
  questionLabel.textContent = questionData.question;

  const yesInput = document.createElement('input');
  yesInput.type = 'radio';
  yesInput.name = `question${questionData.id}`;
  yesInput.value = 'yes';

  const noInput = document.createElement('input');
  noInput.type = 'radio';
  noInput.name = `question${questionData.id}`;
  noInput.value = 'no';
  noInput.checked = true; 

  questionContainer.appendChild(questionLabel);
  questionContainer.appendChild(yesInput);
  questionContainer.appendChild(document.createTextNode(' Oui '));
  questionContainer.appendChild(noInput);
  questionContainer.appendChild(document.createTextNode(' Non '));

  yesInput.addEventListener('click', handleAnswer);
  noInput.addEventListener('click', handleAnswer);
}

function updateScore(userAnswer) {
  const currentQuestion = questions[currentQuestionIndex];

  if (userAnswer === 'yes') {
    scoreTotal -= currentQuestion.poids;
  }
}

function handleAnswer(event) {
  const userAnswer = event.target.value;
  updateScore(userAnswer);

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showCurrentQuestion();
  } else {
    document.getElementById('testForm').style.display = 'none';
    document.getElementById('submitTest').style.display = 'inline';
  }
}

function displayResults() {
  const resultText = document.getElementById('resultText');
  let feedback = '';

  if (scoreTotal >= 86) {
    feedback = "Votre santé mentale semble excellente. Continuez ainsi!";
  } else if (scoreTotal >= 61) {
    feedback = "Votre santé mentale est globalement bonne, mais il est important de rester vigilant.";
  } else if (scoreTotal >= 31) {
    feedback = "Vous avez quelques préoccupations concernant votre santé mentale. Pensez à en parler à un professionnel.";
  } else {
    feedback = "Votre santé mentale montre des signes de détresse. Il est recommandé de consulter un spécialiste.";
  }

  resultText.textContent = `Votre score est de ${scoreTotal}. ${feedback}`;
  document.getElementById('resultContainer').style.display = 'block';
}

document.getElementById('startTest').addEventListener('click', function() {
  document.getElementById('testForm').style.display = 'block';
  showCurrentQuestion();
  document.getElementById('startTest').style.display = 'none';
});

document.getElementById('testForm').addEventListener('submit', function(event) {
  event.preventDefault();
  displayResults();
});
