import path from "path";
import fs from "fs";
import randomWords from "random-words";

const COUNT = 1000;
const FILENAME = "1000.json";
const OUTPUT = path.resolve(__dirname, "output", FILENAME);

const sections = ["book", "bicycle", "hardware", "car", "furniture"];

const json = { store: {} };

sections.map((section) => {
  const sectionData = [];
  for (let i = 0; i < COUNT; i++) {
    sectionData.push({
      name: randomWords({ exactly: 3, join: " " }),
      price: Math.round(Math.random() * 100000) / 100,
      color: randomWords({ exactly: 1, join: " " }),
      manufacturer: randomWords({ exactly: 3, join: " " }),
      tags: randomWords(5),
    });

    json.store[section] = sectionData;
  }
});

console.log(path.dirname(OUTPUT));

if (!fs.existsSync(path.dirname(OUTPUT))) {
  fs.mkdirSync(path.dirname(OUTPUT));
}
fs.writeFileSync(OUTPUT, JSON.stringify(json, null, 2));
