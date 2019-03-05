class Answerer {
  constructor({ url }) {
    this.url = url;
  }

  async answer(text) {
    const response = await fetch(this.url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ text })
    });
    return response.text();
  }
}

export { Answerer };
