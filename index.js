import { Answerer } from "./answerer.js";
import { Synthesizer } from "./synthesizer.js";
import { Recognizer } from "./recognizer.js";
import { urlAnswerer, urlTextToContext, urlContextToWave } from "./config.js"

const answerer = new Answerer({ url: urlAnswerer });
const synthesizer = new Synthesizer({
  urlTextToContext: urlTextToContext,
  urlContextToWave: urlContextToWave
});

let flushFlag = false;
let flushTimer = null;
let clearTimer = null;

function setInputText(text) {
  document.getElementById("input_text").innerHTML = text;
}

function setOutputText(text) {
  document.getElementById("output_text").innerHTML = text;
}

function startFlushTimer() {
  flushFlag = false;
  stopFlushTimer();
  flushTimer = setTimeout(() => {
    console.log("on flush");
    flushFlag = true;
    flushTimer = null;
  }, 1000);
}

function stopFlushTimer() {
  if (flushTimer != null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
}

function startClearTimer() {
  stopClearTimer();
  clearTimer = setTimeout(() => {
    console.log("on clear");
    setInputText("");
    clearTimer = null;
  }, 2500);
}

function stopClearTimer() {
  if (clearTimer != null) {
    clearTimeout(clearTimer);
    clearTimer = null;
  }
}

function onSpeechStart() {
  console.log("on speech start");
  startFlushTimer();
}

function onSpeechProcess(text, isPhraseStart, isPhraseEnd) {
  console.log(
    "on speech process",
    "istart",
    isPhraseStart,
    "isend",
    isPhraseEnd
  );
  if (isPhraseStart) {
    startFlushTimer();
  }

  if (isPhraseEnd || flushFlag) {
    setInputText(text);
    startFlushTimer();
  }

  stopClearTimer();
}

function onSpeechStop(text) {
  console.log("on speech stop");
  setInputText(text);
  // startClearTimer();
  stopFlushTimer();

  createAndPlayResponse(text);
}

async function createAndPlayResponse(textQuestion) {
  const text = await answerer.answer(textQuestion);
  const context = await synthesizer.textToContext(text);
  const audio = await synthesizer.contextToWave(context);
  audio.start(0);
  setOutputText(text);
}

const recognizer = new Recognizer({
  onSpeechStart,
  onSpeechProcess,
  onSpeechStop
});

window.onload = () => recognizer.recognize();
