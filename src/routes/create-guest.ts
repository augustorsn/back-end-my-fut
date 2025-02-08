import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";

export function createGuest(app: FastifyInstance) {

    const createGuestSchema = z.object({
        name: z.string(),

    })


    app.post('/guest', async (req, res) => {
        const { name } = createGuestSchema.parse(req.body);
        const exsiteGuest = await prisma.guest.findUnique({
            where: { name },
        });

        if (exsiteGuest) {
            return res.status(400).send({ message: "User already exists" });
        }


        const user = await prisma.guest.create({
            data: {
                name
            }
        });
        return res.status(201).send(user);
    });


    const createGuestSchemaDelete = z.object({
        id: z.string(),

    })



    app.delete('/guest/:id', async (req, res) => {
        try {
            // Validação com Zod
            const { id } = createGuestSchemaDelete.parse(req.params);
            const guestId = id; // Converte para número

            const existingGuest = await prisma.guest.findUnique({
                where: { id: guestId }
            });

            if (!existingGuest) {
                return res.status(404).send({ message: "Convidado não encontrado" });
            }

            await prisma.guest.delete({
                where: { id: guestId }
            });

            return res.status(204).send(); // 204: No Content (sucesso, sem corpo de resposta)
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).send({ message: "ID inválido", errors: error.errors });
            }
            console.error(error);
            return res.status(500).send({ message: "Erro interno no servidor" });
        }
    });

    // Schema de validação com Zod
    const updateGuestSchema = z.object({
        name: z.string().min(1, "Status não pode ser vazio")
    });

    // Rota PATCH para atualizar o status do convidado
    app.patch('/guest/:id', async (request, res) => {
        try {
            const { id } = createGuestSchemaDelete.parse(request.params);
          
            const existingGuest = await prisma.guest.findUnique({
                where: { id: id }
            });

            // Validação do corpo da requisição
            const { name } = updateGuestSchema.parse(request.body);

           
            if (!existingGuest) {
                return res.status(404).send({ message: "Convidado não encontrado" });
            }

            // Atualiza o convidado no banco de dados
            const updatedGuest = await prisma.guest.update({
                where: { id },
                data: { name: name }
            });

            return res.status(200).send(updatedGuest);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).send({ message: "Dados inválidos", errors: error.errors });
            }
            console.error(error);
            return res.status(500).send({ message: "Erro interno no servidor" });
        }
    });

}