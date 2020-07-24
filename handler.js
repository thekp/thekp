'use strict';
const { Octokit } = require('@octokit/core');

const secrets = require('./secrets.json');
const upperFirst = require('./lib/upperFirst');
const getPokeNum = require('./lib/getPokeNum');
const fetch = require('./lib/nodeFetch');

const TEMPLATE_POKE_NAME = /{{ pokemon_name }}/g;
const TEMPLATE_POKE_IMG = /{{ pokemon_img }}/g;
const TEMPLATE_README =
  "# This week's random Pokemon is... {{ pokemon_name }}\n\n![{{ pokemon_name }} shiny sprite]({{ pokemon_img }})";
const { GITHUB_TOKEN, GITHUB_USERNAME } = secrets;

const updateReadme = async () => {
  const pokeAPI = `https://pokeapi.co/api/v2/pokemon/${getPokeNum()}`;
  const { sprites, name } = await fetch(pokeAPI);

  const newReadMe = TEMPLATE_README.replace(
    TEMPLATE_POKE_NAME,
    upperFirst(name),
  ).replace(TEMPLATE_POKE_IMG, sprites.front_shiny);

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
  });

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
      message: 'chore: update pokemon of the day',
      content: Buffer.from(newReadMe).toString('base64'),
    },
  );
};

module.exports.updateReadme = updateReadme;
