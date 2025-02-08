import fastifyJwt from "@fastify/jwt";
import dotenv from 'dotenv';
import fastify from "fastify";
import { createGuest } from "./routes/create-guest";
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";
import { profile } from "./routes/profile";
import { sorteio } from "./routes/sorteio";
import { updateUser } from "./routes/update-user";

// Carrega as variáveis de ambiente
dotenv.config();

const app = fastify();
const cors = require("@fastify/cors");
app.register(cors, { origin: "*" });

app.register(createUser);
app.register(login);
app.register(profile);
app.register(updateUser);
app.register(sorteio);
app.register(createGuest);

app.register(fastifyJwt, {
    secret: process.env.SECRET_KEY || 'default-secret',
    sign: {
        expiresIn: '1h', // Tempo de expiração do token (1 hora)
    },
});

app.listen({
    port: 3333,
     host: "0.0.0.0"
}).then(() => {
    console.log('Listening on port http://localhost:3333');
})