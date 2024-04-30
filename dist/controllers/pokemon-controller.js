"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPokemon = exports.getOnePokemon = exports.getAllPokemon = void 0;
const redis_config_1 = require("../config/redis-config");
const axios_1 = __importDefault(require("axios"));
const getAllPokemon = (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { offset, limit } = req.body;
    try {
        const allPokemonExistRedis = yield redis_config_1.redisClient.get(`allPokemon`);
        let allPokemons = [];
        if (allPokemonExistRedis) {
            allPokemons = JSON.parse(allPokemonExistRedis);
        }
        else {
            const res = yield axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/?limit=1302`);
            res.data.results.map((item) => {
                allPokemons.push({ pokemon: item.name, number: item.url.split('/')[6] });
            });
            redis_config_1.redisClient.set(`allPokemon`, JSON.stringify(allPokemons), "EX", 60 * 20)
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
                const pokeFormExistRedis = yield redis_config_1.redisClient.get(`pokeForm-${i}`);
                if (pokeFormExistRedis) {
                    resData.push(JSON.parse(pokeFormExistRedis));
                }
                else {
                    try {
                        const res2 = yield axios_1.default.get(`https://pokeapi.co/api/v2/pokemon-form/${i}`);
                        const data = res2.data;
                        const pokemon = {
                            id: data === null || data === void 0 ? void 0 : data.id,
                            name: data === null || data === void 0 ? void 0 : data.name,
                            order: data === null || data === void 0 ? void 0 : data.order,
                            imgFront: (_a = data === null || data === void 0 ? void 0 : data.sprites) === null || _a === void 0 ? void 0 : _a.front_default,
                            imgBack: (_b = data === null || data === void 0 ? void 0 : data.sprites) === null || _b === void 0 ? void 0 : _b.back_default,
                            types: data === null || data === void 0 ? void 0 : data.types,
                        };
                        redis_config_1.redisClient.set(`pokeForm-${i}`, JSON.stringify(pokemon), "EX", 60 * 20)
                            .then(() => {
                            console.log(`pokeForm-${i} stored in Redis`);
                        })
                            .catch(err => {
                            console.error('Error storing JSON object in Redis:', err);
                        });
                        resData.push(pokemon);
                    }
                    catch (err) {
                        console.log(`Error while fetching pokeForm-${i} from API`, err);
                    }
                }
            }
            catch (err) {
                console.log(`Error while fetching pokeform-${i} from Redis`, err);
            }
        }
        return response === null || response === void 0 ? void 0 : response.status(200).send({ pokemons: resData, allPokemons });
    }
    catch (err) {
        console.log(err);
        return response.status(500).send({ error: err });
    }
});
exports.getAllPokemon = getAllPokemon;
//https://pokeapi.co/api/v2/pokemon-form/3/
const getOnePokemon = (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const name = req.params.id;
    try {
        const pokemonExistRedis = yield redis_config_1.redisClient.get(`pokemon-${name}`);
        if (pokemonExistRedis) {
            return response === null || response === void 0 ? void 0 : response.status(200).send({ pokemon: JSON.parse(pokemonExistRedis) });
        }
        else {
            const res = yield axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = res.data;
            const pokemon = {
                id: data === null || data === void 0 ? void 0 : data.id,
                name: data === null || data === void 0 ? void 0 : data.name,
                height: (data === null || data === void 0 ? void 0 : data.height) * 10,
                order: data === null || data === void 0 ? void 0 : data.order,
                imgFront: (_c = data === null || data === void 0 ? void 0 : data.sprites) === null || _c === void 0 ? void 0 : _c.front_default,
                imgBack: (_d = data === null || data === void 0 ? void 0 : data.sprites) === null || _d === void 0 ? void 0 : _d.back_default,
                abilities: data === null || data === void 0 ? void 0 : data.abilities,
                stats: data === null || data === void 0 ? void 0 : data.stats,
                types: data === null || data === void 0 ? void 0 : data.types,
                weight: (data === null || data === void 0 ? void 0 : data.weight) / 10,
            };
            redis_config_1.redisClient.set(`pokemon-${name}`, JSON.stringify(pokemon), "EX", 60 * 20)
                .then(() => {
                console.log('JSON object stored in Redis');
            })
                .catch(err => {
                console.error('Error storing JSON object in Redis:', err);
            });
            return response.status(200).send({ pokemon });
        }
    }
    catch (err) {
        console.log(err);
        return response.status(500).send({ error: err });
    }
});
exports.getOnePokemon = getOnePokemon;
const searchPokemon = (req, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const name = req.params.name;
    try {
        const allPokemonExistRedis = yield redis_config_1.redisClient.get(`allPokemon`);
        let allPokemons = [];
        if (allPokemonExistRedis) {
            allPokemons = JSON.parse(allPokemonExistRedis);
        }
        else {
            const res = yield axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/?limit=1302`);
            res.data.results.map((item) => {
                allPokemons.push({ pokemon: item.name, number: item.url.split('/')[6] });
            });
            redis_config_1.redisClient.set(`allPokemon`, JSON.stringify(allPokemons), "EX", 60 * 20)
                .then(() => {
                console.log(`allPokemon stored in Redis`);
            })
                .catch(err => {
                console.error('Error storing allPokemon in Redis:', err);
            });
        }
        const searchResults = [];
        allPokemons.map((pokemon) => {
            if (pokemon.pokemon.toLowerCase().includes(name.toLowerCase())) {
                console.log(pokemon.pokemon.toLowerCase(), " <== ", name.toLowerCase());
                searchResults.push(pokemon.pokemon);
            }
        });
        const finalResult = [];
        for (let i = 0; i < searchResults.length; i++) {
            try {
                const pokeFormExistRedis = yield redis_config_1.redisClient.get(`pokeForm-${searchResults[i]}`);
                if (pokeFormExistRedis) {
                    finalResult.push(JSON.parse(pokeFormExistRedis));
                }
                else {
                    try {
                        const res2 = yield axios_1.default.get(`https://pokeapi.co/api/v2/pokemon-form/${searchResults[i]}`);
                        const data = res2.data;
                        const pokemon = {
                            id: data === null || data === void 0 ? void 0 : data.id,
                            name: data === null || data === void 0 ? void 0 : data.name,
                            order: data === null || data === void 0 ? void 0 : data.order,
                            imgFront: (_e = data === null || data === void 0 ? void 0 : data.sprites) === null || _e === void 0 ? void 0 : _e.front_default,
                            imgBack: (_f = data === null || data === void 0 ? void 0 : data.sprites) === null || _f === void 0 ? void 0 : _f.back_default,
                            types: data === null || data === void 0 ? void 0 : data.types,
                        };
                        redis_config_1.redisClient.set(`pokeForm-${searchResults[i]}`, JSON.stringify(pokemon), "EX", 60 * 20)
                            .then(() => {
                            console.log(`pokeForm-${searchResults[i]} stored in Redis`);
                        })
                            .catch(err => {
                            console.error('Error storing JSON object in Redis:', err);
                        });
                        finalResult.push(pokemon);
                    }
                    catch (err) {
                        console.log(`Error while fetching pokeForm-${i} from API`, err);
                    }
                }
            }
            catch (err) {
                console.log(`Error while fetching pokeform-${i} from Redis`, err);
            }
        }
        return response === null || response === void 0 ? void 0 : response.status(200).send({ pokemons: finalResult, allPokemons });
    }
    catch (err) {
        return response.status(500).send({ error: err });
    }
});
exports.searchPokemon = searchPokemon;
