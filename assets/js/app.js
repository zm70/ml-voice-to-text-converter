window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!window.SpeechRecognition) {
  alert('Your browser does not support Speech Recognition. Please try using Chrome or Edge.');
}

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US'; // default lang

const transcriptDiv = document.getElementById('transcript');
const toggleButton = document.getElementById('toggle');
const languageSelector = document.getElementById('languageSelector');
const saveButton = document.getElementById('saveTranscript');
const savedTranscriptsList = document.getElementById('savedTranscripts');

let isListening = false;
let currentFinalTranscript = ""; 

languageSelector.addEventListener('change', (event) => {
  recognition.lang = event.target.value;
  console.log(`Language set to: ${recognition.lang}`);
  if (event.target.value === 'fa-IR') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
});

recognition.onresult = (event) => {
  let finalTranscript = '';
  let interimTranscript = '';

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript;
    } else {
      interimTranscript += transcript;
    }
  }
  
  if (finalTranscript.trim() !== "") {
    currentFinalTranscript += finalTranscript + " ";
  }

  transcriptDiv.innerHTML = `<strong>Final:</strong> ${currentFinalTranscript}<br/><em>Interim:</em> ${interimTranscript}`;
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
};

toggleButton.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
      toggleButton.textContent = 'Start Recognition';
      toggleButton.classList.remove('btn-primary');
      toggleButton.classList.add('btn-default');
      isListening = false;
    } else {
      recognition.start();
      toggleButton.textContent = 'Stop Recognition';
      toggleButton.classList.remove('btn-default');
      toggleButton.classList.add('btn-primary');
      isListening = true;
    }
  });  

saveButton.addEventListener('click', () => {
  if (currentFinalTranscript.trim() !== "") {
    
    recognition.stop();
    toggleButton.textContent = 'Start Recognition';
    toggleButton.classList.remove('btn-primary');
    toggleButton.classList.add('btn-default');
    isListening = false;

    const li = document.createElement('li');
    li.textContent = currentFinalTranscript.trim();
    li.classList.add('list-group-item');
    savedTranscriptsList.appendChild(li);
    currentFinalTranscript = "";
    transcriptDiv.innerHTML = `Your transcribed text will appear here...`;
  } else {
    alert("There is no transcript to save!");
  }
});
