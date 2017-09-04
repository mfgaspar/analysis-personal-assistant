'use strict';

const SERVER_URL = 'https://smart.mfgaspar.org:8443';
const ENTER_KEY_CODE = 13;

const socket = io(SERVER_URL, {secure: true});
socket.connect();

const resultDiv = document.getElementById("result");
//const outputYou = document.querySelector('.output-you');
//const outputBot = document.querySelector('.output-bot');

const SpeechRecog =  window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.SpeechRecognition;

const recognition = new SpeechRecog();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onerror = function(event) {
  console.log(event.error);
}

document.querySelector('button#rec').addEventListener('click', function() {
  recognition.start();
});

document.querySelector('input#question').addEventListener('keypress', function() {
  if (event.which !== ENTER_KEY_CODE) return;
  var value = event.target.value;
  event.target.value = "";
  socket.emit('chat message', value);
  console.log('Text has been sent: %s', value);
  createQueryNode(value);
});

recognition.addEventListener('speechstart', function() {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', function(e) {
  console.log('Result has been detected.');

  let last = e.results.length - 1;
  let text = e.results[last][0].transcript;
  socket.emit('chat message', text);
  //outputYou.textContent = text;
  console.log('Confidence: ' + e.results[0][0].confidence);
  console.log('Question sent: %s', text);
  createQueryNode(text);
});

recognition.addEventListener('speechend', function() {
  recognition.stop();
});

recognition.addEventListener('error', function(e) {
  // outputBot.textContent = 'Error: ' + e.error;
  console.log('Error: ' + e.error);
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);
}

socket.on('bot reply', function(replyText) {

  if(replyText == '') replyText = '(No answer...)';
  synthVoice(replyText);
  console.log('Answer: %s', replyText);
  var node = createResponseNode();
  setResponseOnNode(replyText, node);
  //outputBot.textContent = replyText;
});


