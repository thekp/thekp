module.exports = () => {
  min = Math.ceil(1); // bulbasaur is first :)
  max = Math.floor(807); // max number of pokemon on the pokeapi
  return Math.floor(Math.random() * (max - min)) + min;
};
