import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

export function profile(app: FastifyInstance) {
    // Middleware para validar autenticação do Google
    app.addHook("onRequest", async (req: FastifyRequest, res: FastifyReply) => {
        try {
            let token = req.headers.authorization;
            console.log("token1 =>" + token);
            if (token && token.startsWith("Bearer ")) {
                token = token.split(" ")[1]; // Pegando somente o token (após "Bearer ")
            }
        

            console.log("token2 =>" + token);
            if (!token) {
                return res.status(401).send({ error: "Autenticação falhou" });
            }

            console.log("token3 =>" + token);
           
            const { data } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            
        } catch (error) {
            return res.status(401).send({ error: "Autenticação falhou" });
        }
    });

    // Rota protegida: Apenas usuários autenticados podem acessar
    app.get("/profile", async (req: FastifyRequest, res: FastifyReply) => {
        const users = await prisma.user.findMany();
        const guest = await prisma.guest.findMany();

        // Mapeando os usuários para o formato desejado (id e name)
        const usuarios = [
            ...users.map((user) => ({ id: user.id, name: user.name })),
            ...guest.map((guest) => ({ id: guest.id, name: guest.name })),
        ];

        return res.status(200).send({           
            user: (req as any).user, // Dados do usuário autenticado
            usuarios: usuarios,
        });
    });
}
