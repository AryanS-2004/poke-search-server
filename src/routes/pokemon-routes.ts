import express from 'express';
import { getAllPokemon, getOnePokemon, searchPokemon } from '../controllers/pokemon-controller';

const pokemonRouter = express.Router();

pokemonRouter.route('/').post(getAllPokemon);
pokemonRouter.route('/:id').get(getOnePokemon);
pokemonRouter.route('/search/:name').post(searchPokemon);

export default pokemonRouter;