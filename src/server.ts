import fastifyJwt from "@fastify/jwt";
import dotenv from 'dotenv';
import fastify from "fastify";
import { createUser } from "./routes/create-user";
import { login } from "./routes/login";
import { profile } from "./routes/profile";

// Carrega as variáveis de ambiente
dotenv.config();

const app = fastify();


app.register(createUser);
app.register(login);
app.register(profile);

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'default-secret',
    sign: {
        expiresIn: '1h', // Tempo de expiração do token (1 hora)
    },
});

app.listen({
    port: 3333
}).then(() => {
    console.log('Listening on port http://localhost:3333');
})