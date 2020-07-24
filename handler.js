'use strict';
const { Octokit } = require('@octokit/core');

const secrets = require('./secrets.json');
const upperFirst = require('./lib/upperFirst');
const getPokeNum = require('./lib/getPokeNum');
const fetch = require('./lib/nodeFetch');

const TEMPLATE_POKE_NAME = /{{ pokemon_name }}/g;
const TEMPLATE_POKE_IMG = /{{ pokemon_img }}/g;
const TEMPLATE_POKE_INFO = /{{ pokemon_info }}/g;

const TEMPLATE_README =
  "# Today's random Pokemon is... {{ pokemon_name }}\n\n![{{ pokemon_name }} shiny sprite]({{ pokemon_img }})\n\n<details>\n<summary>Additional info about {{ pokemon_name }}</summary>\n{{ pokemon_info }} </details>";
let initialTable = '\n| srpite type | image |\n|------|------|';

const { GITHUB_TOKEN, GITHUB_USERNAME } = secrets;
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const updateReadme = async () => {
  const pokeAPI = `https://pokeapi.co/api/v2/pokemon/${getPokeNum()}`;
  const { sprites, name } = await fetch(pokeAPI);

  const entries = Object.entries(sprites);
  for (const [view, link] of entries) {
    if (link && view !== 'front_shiny') {
      initialTable += `\n| ${view} | ![{{ pokemon_name }} ${view} sprite](${link}) |`;
    }
  }
  const newReadMe = TEMPLATE_README.replace(TEMPLATE_POKE_INFO, initialTable)
    .replace(TEMPLATE_POKE_NAME, upperFirst(name))
    .replace(TEMPLATE_POKE_IMG, sprites.front_shiny);

  const { data } = await octokit.request(
    `GET /repos/${GITHUB_USERNAME}/${GITHUB_USERNAME}/readme`,
  );

  console.log('Updating Readme with OctoKit...');
  console.log(`This week's random pokemon is ${name}`);
  await octokit.request(
    `PUT /repos/${GITHUB_USERNAME}/${GITHUB_USERNAME}/contents/README.md`,
    {
      sha: data.sha,
      path: 'README.md',
      message: `chore: Today's Pokemon is ${name}`,
      content: Buffer.from(newReadMe).toString('base64'),
    },
  );
};

module.exports.updateReadme = updateReadme;
