class Synthesizer {
  constructor({ url }) {
    this.url = url;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this._audioContext = new AudioContext();
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
