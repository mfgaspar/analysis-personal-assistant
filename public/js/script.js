'use strict';


const socket = io('https://192.168.56.101:8443', {secure: true});
socket.connect(); 

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const SpeechRecog =  window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.SpeechRecognition;

const recognition = new SpeechRecog();

console.log(recognition);

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', function() {
  recognition.start();
});

recognition.addEventListener('speechstart', function() {
  console.log('Speech has been detected.');
});

recognition.onerror = function(event) {
  console.log(event.error);
}

recognition.addEventListener('result', function(e) {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;

  outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', function() {
  recognition.stop();
});

recognition.addEventListener('error', function(e) {
  outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});
