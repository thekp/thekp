const readFile = require('./functions/readFile');
const updateFile = require('./functions/updateFile');
const upperFirst = require('./functions/upperFirst');
const getPokeNum = require('./functions/getPokeNum');
const fetchPokeData = require('./functions/fetchPokeData');
const runExec = require('./functions/runExec');

const TEMPLATE_POKE_NAME = /{{ pokemon_name }}/g;
const TEMPLATE_POKE_IMG = /{{ pokemon_img }}/g;
const README_RESET =
  "# Today's random Pokemon is... {{ pokemon_name }}\n\n![{{ pokemon_name }}]({{ pokemon_img }})";
const README_FILE_PATH = './README.md';
const POKEMON_ENDPOINT = `https://pokeapi.co/api/v2/pokemon/${getPokeNum()}`;

const stageCommitPushChanges = () => {
  runExec({
    command: `git add README.md`,
  })
    .then(() =>
      runExec({ command: `git commit -m "chore: update pokemon on README"` }),
    )
    .then(() => runExec({ command: `git push origin HEAD` }));
};

const updateReadMe = async () => {
  updateFile(README_FILE_PATH)(README_RESET);

  const { sprites, name } = await fetchPokeData(POKEMON_ENDPOINT);
  const templateReadMe = await readFile(README_FILE_PATH);

  const newReadMe = templateReadMe
    .replace(TEMPLATE_POKE_NAME, upperFirst(name))
    .replace(TEMPLATE_POKE_IMG, sprites.front_shiny);

  updateFile(README_FILE_PATH)(newReadMe);

  stageCommitPushChanges();
};

updateReadMe();
