import express from 'express';
import { notFound, errorHandler } from "./middleware/error-middleware";
import dotenv from 'dotenv';
import cors from 'cors';
import pokemonRouter from './routes/pokemon-routes';
import { redisClient } from './config/redis-config';

dotenv.config();

const port = 3004;


const app = express();
app.use(express.json());
app.use(cors());


app.use("/v1/pokemons", pokemonRouter)

app.get("/", (req, res) => {
    res.json({ msg: "The server is working, Nothing to worry about." })
})


//Error handling 
app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
    console.log("The server is listening on port " + port);
});