const urlApi = 'https://pokeapi.co/api/v2/pokemon/';
const gradePokemons = document.querySelector('.grade-pokemon');
const detalhesPokemons = document.querySelector('.detalhes-pokemon');
const indicadorDeCarregamento = document.querySelector('.carregando');
const campoDeBusca = document.getElementById('campo-busca');
const botaoDeBusca = document.getElementById('botao-busca');

// Função para buscar a lista de Pokémon
async function buscarListaDePokemons() {
  indicadorDeCarregamento.style.display = 'block';
  for (let id = 1; id <= 151; id++) {
    const dadosPokemon = await buscarDetalhesDoPokemon(id);
    const cartao = criarCartaoDoPokemon(dadosPokemon);
    gradePokemons.appendChild(cartao);
  }
  indicadorDeCarregamento.style.display = 'none';
}

// Função para buscar os detalhes de um Pokémon
async function buscarDetalhesDoPokemon(idOuNome) {
  try {
    const resposta = await fetch(`${urlApi}${idOuNome}`);
    const dados = await resposta.json();
    return {
      nome: dados.name,
      sprite: dados.sprites.front_default,
      arteOficial: dados.sprites.other['official-artwork'].front_default,
      tipos: dados.types.map(tipo => tipo.type.name)
    };
  } catch (erro) {
    console.error('Erro ao buscar Pokémon:', erro);
    return null;
  }
}

// Função para criar o cartão de um Pokémon
function criarCartaoDoPokemon(pokemon) {
  const cartao = document.createElement('li');
  cartao.className = 'cartao-pokemon';
  cartao.innerHTML = `
    <img src="${pokemon.sprite}" alt="${pokemon.nome}">
    <p>${pokemon.nome}</p>
  `;
  cartao.addEventListener('click', () => exibirDetalhesDoPokemon(pokemon));
  return cartao;
}

// Função para exibir os detalhes de um Pokémon
function exibirDetalhesDoPokemon(pokemon) {
  detalhesPokemons.innerHTML = `
    <img src="${pokemon.arteOficial}" alt="${pokemon.nome}">
    <h2>${pokemon.nome}</h2>
    ${pokemon.tipos.map(tipo => `<span class="tipo-badge tipo-${tipo}">${tipo}</span>`).join('')}
  `;
}

// Função para buscar um Pokémon pelo nome
async function buscarPokemonPeloNome() {
  const nome = campoDeBusca.value.trim().toLowerCase();
  if (!nome) {
    alert('Por favor, insira o nome de um Pokémon.');
    return;
  }

  const dadosPokemon = await buscarDetalhesDoPokemon(nome);
  if (dadosPokemon) {
    gradePokemons.innerHTML = ''; // Limpa a grade
    const cartao = criarCartaoDoPokemon(dadosPokemon);
    gradePokemons.appendChild(cartao);
    exibirDetalhesDoPokemon(dadosPokemon);
  } else {
    alert('Pokémon não encontrado. Verifique o nome e tente novamente.');
  }
}

// Adiciona o evento de clique ao botão de busca
botaoDeBusca.addEventListener('click', buscarPokemonPeloNome);

// Carrega a lista inicial de Pokémon
buscarListaDePokemons();