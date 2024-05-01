"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middleware/error-middleware");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const pokemon_routes_1 = __importDefault(require("./routes/pokemon-routes"));
dotenv_1.default.config();
const port = 3004;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/v1/pokemons", pokemon_routes_1.default);
app.get("/", (req, res) => {
    res.json({ msg: "The server is working, Nothing to worry about." });
});
//Error handling 
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
app.listen(port, () => {
    console.log("The server is listening on port " + port);
});
