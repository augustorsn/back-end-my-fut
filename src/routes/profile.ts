import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export function profile(app: FastifyInstance) {

    app.addHook("onRequest", async (req, res) => {
        try {
            await req.jwtVerify();

        } catch (error) {
            return res.status(401).send({ error });
        }

    });


    app.get("/profile", async (req, res) => {
        const users = await prisma.user.findMany();
        const guest = await prisma.guest.findMany();
    
        // Mapeando os usuários para o formato desejado (id e name)
        const usuarios = [
            ...users.map(user => ({ id: user.id, name: user.name })),
            ...guest.map(guest => ({ id: guest.id, name: guest.name }))
        ];
    
        return res.status(200).send({ usuarios: usuarios });
    });
}