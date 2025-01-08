import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";
import { verifyPassword } from "../utils/hash";

export function login(app: FastifyInstance) {

    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8, "Senha muito curta")
    })

    app.post('/login', async (req, res) => {
        const { email, password } = loginSchema.parse(req.body);
        const existeUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existeUser) {
            return res.status(400).send({ message: "User not found" });
        }

        const isPassword = await verifyPassword(password,existeUser.password);

        if (!isPassword) {
            return res.status(400).send({ message: "Incorrect password" });
        }
        

        const token = app.jwt.sign({id:existeUser.id,email: existeUser.email})
        return res.status(200).send({token});
    });
}