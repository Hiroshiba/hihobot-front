import { Answerer } from "./answerer.js";
import { Synthesizer } from "./synthesizer.js";

const urlAnswerer = "http://localhost:8000/answer?text=";
const urlSynthesizer = "http://localhost:8000/synthesize?text=";
const textQuestion = "好きな曲はなんですか。";

async function main() {
  const answerer = new Answerer({ url: urlAnswerer });
  const synthesizer = new Synthesizer({ url: urlSynthesizer });

  const text = await answerer.answer(textQuestion);
  const audio = await synthesizer.synthesize(text);
  audio.start(0);
  console.log("now playing... " + text);
}

main();
