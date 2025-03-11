import fastifyOauth2 from "@fastify/oauth2";
import axios from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

// Interface para armazenar os dados do usuário autenticado
interface GoogleUser {
    id: string;
    email: string;
    name: string;
    picture: string;
    token: string;
}

async function revokeToken(token: string, tokenType: string, clientId?: string): Promise<void> {
    try {
        const url = `https://oauth2.googleapis.com/revoke?token=${token}`;

        // Requisição para revogar o token
        await axios.post(url);

        console.log(`Token de tipo ${tokenType} revogado com sucesso!`);
    } catch (error) {
        console.error(`Erro ao revogar o ${tokenType}:`, error);
        throw error; // Propaga o erro para o controlador
    }
}

// 🔹 Função única que registra OAuth2 e as rotas de autenticação
export function setupAuth(app: FastifyInstance) {
    // Registrando o plugin de autenticação OAuth2 do Google
    app.register(fastifyOauth2, {
        name: "googleOAuth2",
        scope: ["profile"],
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID || "<CLIENT_ID>",
                secret: process.env.GOOGLE_CLIENT_SECRET || "<CLIENT_SECRET>",
            },
            auth: fastifyOauth2.GOOGLE_CONFIGURATION,
        },
        startRedirectPath: "/login/google",
        callbackUri: "http://localhost:3333/login/google/callback",
    });

    // 🔹 Registra a rota somente após o plugin ter sido carregado
    app.after(() => {
        app.get("/login/google/callback", async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                // Obtendo o token do Google
                const result = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
                const accessToken = result.token.access_token;
                console.log('acesstoken ' + accessToken);
                // Se não houver token de acesso, redireciona para a tela de login do Google
                if (!accessToken) {
                    // Gerar a URL de autorização para redirecionar para a tela de login do Google
                    const authorizationUrl = app.googleOAuth2.generateAuthorizationUrl({
                        redirect_uri: "http://localhost:3333/login/google/callback",
                    });

                    // Redirecionando o usuário para o Google para autenticação
                    reply.redirect(authorizationUrl);
                    return;
                }
                // Buscando dados do usuário autenticado
                const { data } = await axios.get<GoogleUser>("https://www.googleapis.com/oauth2/v2/userinfo", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                data.token = accessToken;
                reply.send(data);
            } catch (error) {
                reply.status(500).send({ error: "Erro na autenticação", details: error });
            }
        });



        // Rota de logout que limpa o cookie de sessão
        app.get("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
            try {
              


                reply.clearCookie("session_token", {
                    path: "/",
                    httpOnly: true,
                    secure: true, // Tornar seguro para produção
                });

                
                let token = "ya29.a0AeXRPp4_kQ9eORm7xq3KitXKFcu4LOYbmQ96rH3i-rudwLtHcPjmgorquavboYMxXB6Lf88JvQRhTGnCQw09FT2Ad2sAiYLBE3TuEpMOXiOHGAw1XAWPrVnqSwtNojh_AZ3X6WsFgcfLHFAtf9qRq9wOQW4lMbtrHTlJsHCoaCgYKAUoSARMSFQHGX2Mig1l5Anx3EJsOQNnEo0_sJA0175";
                await revokeToken(token,"access_token",process.env.GOOGLE_CLIENT_ID);
                reply.send({ message: "Logout realizado com sucesso!" });
            
                
            } catch (error) {
                reply.status(500).send({ error: "Erro ao fazer logout", details: error });
            }
        });
    });
}
