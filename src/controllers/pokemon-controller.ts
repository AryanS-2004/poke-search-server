import { Request, Response } from "express";
import { redisClient } from "../config/redis-config";
import axios from "axios";


export const getAllPokemon = async (req: Request, response: Response) => {

  const { offset, limit } = req.body;
  try {
    const allPokemonExistRedis: any = await redisClient.get(`allPokemon`);
    let allPokemons: any = [];
    if (allPokemonExistRedis) {
      allPokemons = JSON.parse(allPokemonExistRedis);
    } else {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=1302`);
      res.data.results.map((item: any) => {
        allPokemons.push({ pokemon: item.name, number: item.url.split('/')[6] })
      })
      redisClient.set(`allPokemon`, JSON.stringify(allPokemons), "EX", 60 * 20)
        .then(() => {
          console.log(`allPokemon stored in Redis`);
        })
        .catch(err => {
          console.error('Error storing allPokemon in Redis:', err);
        });
    }


    const resData = [];
    for (let i = offset + 1; i < offset + 1 + limit; i++) {
      try {
        const pokeFormExistRedis: any = await redisClient.get(`pokeForm-${i}`);
        if (pokeFormExistRedis) {
          resData.push(JSON.parse(pokeFormExistRedis));
        } else {
          try {
            const res2 = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${i}`);

            const data: any = res2.data;
            const pokemon = {
              id: data?.id,
              name: data?.name,
              order: data?.order,
              imgFront: data?.sprites?.front_default,
              imgBack: data?.sprites?.back_default,
              types: data?.types,
            };
            redisClient.set(`pokeForm-${i}`, JSON.stringify(pokemon), "EX", 60 * 20)
              .then(() => {
                console.log(`pokeForm-${i} stored in Redis`);
              })
              .catch(err => {
                console.error('Error storing JSON object in Redis:', err);
              });
            resData.push(pokemon);
          } catch (err) {
            console.log(`Error while fetching pokeForm-${i} from API`, err);
          }
        }
      } catch (err) {
        console.log(`Error while fetching pokeform-${i} from Redis`, err);
      }
    }
    return response?.status(200).send({ pokemons: resData, allPokemons });
  } catch (err) {
    console.log(err);
    return response.status(500).send({ error: err });
  }
}


//https://pokeapi.co/api/v2/pokemon-form/3/

export const getOnePokemon = async (req: Request, response: Response) => {
  const name = req.params.id;
  try {
    const pokemonExistRedis = await redisClient.get(`pokemon-${name}`);
    if (pokemonExistRedis) {
      return response?.status(200).send({ pokemon: JSON.parse(pokemonExistRedis) });
    } else {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data: any = res.data;
      const pokemon = {
        id: data?.id,
        name: data?.name,
        height: data?.height * 10,
        order: data?.order,
        imgFront: data?.sprites?.front_default,
        imgBack: data?.sprites?.back_default,
        abilities: data?.abilities,
        stats: data?.stats,
        types: data?.types,
        weight: data?.weight / 10,
      };
      redisClient.set(`pokemon-${name}`, JSON.stringify(pokemon), "EX", 60 * 20)
        .then(() => {
          console.log('JSON object stored in Redis');
        })
        .catch(err => {
          console.error('Error storing JSON object in Redis:', err);
        });
      return response.status(200).send({ pokemon });
    }
  } catch (err: any) {
    console.log(err);
    return response.status(500).send({ error: err });
  }

}


export const searchPokemon = async (req: Request, response: Response) => {
  const name = req.params.name;
  try {
    const allPokemonExistRedis: any = await redisClient.get(`allPokemon`);
    let allPokemons: any = [];
    if (allPokemonExistRedis) {
      allPokemons = JSON.parse(allPokemonExistRedis);
    } else {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=1302`);
      res.data.results.map((item: any) => {
        allPokemons.push({ pokemon: item.name, number: item.url.split('/')[6] })
      })
      redisClient.set(`allPokemon`, JSON.stringify(allPokemons), "EX", 60 * 20)
        .then(() => {
          console.log(`allPokemon stored in Redis`);
        })
        .catch(err => {
          console.error('Error storing allPokemon in Redis:', err);
        });
    }
    const searchResults: any = [];
    allPokemons.map((pokemon: any) => {
      if (pokemon.pokemon.toLowerCase().includes(name.toLowerCase())) {
        console.log(pokemon.pokemon.toLowerCase(), " <== ", name.toLowerCase())
        searchResults.push(pokemon.pokemon);
      }
    })
    const finalResult = [];
    for (let i = 0; i < searchResults.length; i++) {
      try {
        const pokeFormExistRedis: any = await redisClient.get(`pokeForm-${searchResults[i]}`);
        if (pokeFormExistRedis) {
          finalResult.push(JSON.parse(pokeFormExistRedis));
        } else {
          try {
            const res2 = await axios.get(`https://pokeapi.co/api/v2/pokemon-form/${searchResults[i]}`);
            const data: any = res2.data;
            const pokemon = {
              id: data?.id,
              name: data?.name,
              order: data?.order,
              imgFront: data?.sprites?.front_default,
              imgBack: data?.sprites?.back_default,
              types: data?.types,
            };
            redisClient.set(`pokeForm-${searchResults[i]}`, JSON.stringify(pokemon), "EX", 60 * 20)
              .then(() => {
                console.log(`pokeForm-${searchResults[i]} stored in Redis`);
              })
              .catch(err => {
                console.error('Error storing JSON object in Redis:', err);
              });
            finalResult.push(pokemon);
          } catch (err) {
            console.log(`Error while fetching pokeForm-${i} from API`, err);
          }
        }
      } catch (err) {
        console.log(`Error while fetching pokeform-${i} from Redis`, err);
      }
    }
    return response?.status(200).send({ pokemons: finalResult, allPokemons });
  } catch (err) {
    return response.status(500).send({ error: err });
  }
}