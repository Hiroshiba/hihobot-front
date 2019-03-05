class Synthesizer {
  constructor({ urlTextToContext, urlContextToWave }) {
    this.urlTextToContext = urlTextToContext;
    this.urlContextToWave = urlContextToWave;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this._audioContext = new AudioContext();
  }

  async textToContext(text) {
    const response = await fetch(this.urlTextToContext, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ text })
    });
    const context = await response.text();
    return context;
  }

  async contextToWave(context) {
    const response = await fetch(this.urlContextToWave, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ context })
    });
    const audioData = await response.arrayBuffer();
    const audioBuffer = await this._audioContext.decodeAudioData(audioData);

    const audioSource = this._audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(this._audioContext.destination);

    audioSource.onended = () => {
      audioSource.buffer = null;
      audioSource.disconnect();
    };

    return audioSource;
  }

  async synthesize(text) {
    const response = await fetch(this.url + text);
    const audioData = await response.arrayBuffer();
    const audioBuffer = await this._audioContext.decodeAudioData(audioData);

    const audioSource = this._audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(this._audioContext.destination);

    audioSource.onended = () => {
      audioSource.buffer = null;
      audioSource.disconnect();
    };

    return audioSource;
  }
}

export { Synthesizer };
