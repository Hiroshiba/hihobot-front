class Answerer {
  constructor({ url }) {
    this.url = url;
  }

  async answer(text) {
    const response = await fetch(this.url + text)
    return response.text();
  }
}

export { Answerer };
