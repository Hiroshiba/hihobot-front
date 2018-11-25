class Recognizer {
  constructor({ onSpeechStart, onSpeechProcess, onSpeechStop }) {
    this.onSpeechStart = onSpeechStart;
    this.onSpeechProcess = onSpeechProcess;
    this.onSpeechStop = onSpeechStop;
  }

  recognize() {
    window.SpeechRecognition =
      window.SpeechRecognition || webkitSpeechRecognition;
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "ja";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onsoundstart = () => {
      console.log("認識中");
    };
    recognition.onnomatch = () => {
      console.log("もう一度試してください");
    };
    recognition.onerror = () => {
      console.log("エラー");
      this.recognize();
    };
    recognition.onsoundend = () => {
      console.log("停止中");
      this.recognize();
    };

    let isFirstResult = true;
    let isPhraseStart = true;
    recognition.onresult = event => {
      let text = "";
      let isFinal = false;
      let results = event.results;
      for (let i = event.resultIndex; i < results.length; i++) {
        text += results[i][0].transcript;

        isFinal = isFinal || results[i].isFinal;
      }

      if (isFirstResult) {
        isFirstResult = false;
        this.onSpeechStart();
        return;
      }

      let isPhraseEnd = false;
      if (!isFinal) {
        const lastIndex = results.length - 1;
        isPhraseEnd = results[lastIndex][0].confidence > 0.5;
        this.onSpeechProcess(text, isPhraseStart, isPhraseEnd);
      } else {
        isFirstResult = true;
        isPhraseEnd = true;
        this.onSpeechStop(text);
      }

      isPhraseStart = false;
      if (isPhraseEnd) {
        isPhraseStart = true;
      }
    };
    recognition.start();
  }
}

export { Recognizer };
