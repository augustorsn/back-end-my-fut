import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";

export function updateUser(app: FastifyInstance) {

    const createUserSchema = z.object({
        email: z.string().email(),
        name: z.string(),
        adm: z.boolean(),
        novoEmail: z.string().email(),
    })

    app.put('/user/update', async (req, res) => {
        const { email, name, adm, novoEmail } = createUserSchema.parse(req.body);
        const existeUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existeUser) {
            return res.status(400).send({ message: "User already exists" });
        }


        const updateUser = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                name: name,
                adm: adm,
                email: novoEmail,

            },
        })
        return res.status(201).send(updateUser);
    });
}