"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pokemon_controller_1 = require("../controllers/pokemon-controller");
const pokemonRouter = express_1.default.Router();
pokemonRouter.route('/').post(pokemon_controller_1.getAllPokemon);
pokemonRouter.route('/:id').get(pokemon_controller_1.getOnePokemon);
pokemonRouter.route('/search/:name').post(pokemon_controller_1.searchPokemon);
exports.default = pokemonRouter;
