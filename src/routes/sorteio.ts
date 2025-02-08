import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export function sorteio(app: FastifyInstance) {

    app.addHook("onRequest", async (req, res) => {
        try {
            await req.jwtVerify();

        } catch (error) {
            return res.status(401).send({ error });
        }

    });

    app.get("/sorteio", async (req, res) => {
        let users = await prisma.user.findMany();
        let usersModel = [...users.map(user => ({ id: user.id, name: user.name }))];
        let guest = await prisma.guest.findMany();
        let guestModel=  [...guest.map(guest => ({ id: guest.id, name: guest.name }))];
        let playersTeamOne=[];
        let playersTeamTwo=[];
        let playersTeamThree=[];
        let playersTeamFour=[];
        let raffleMensalist = usersModel;
        let raffleGuestList = guestModel;
        let tempRaffleMensalist = raffleMensalist.length -1;
        let tempRaffleGuest = raffleGuestList.length -1;

        for (let i = 0; i <= tempRaffleMensalist; i++) {
          let MAX = raffleMensalist.length - 1;
          let rafflePosition = MAX;
      
          if (MAX !== 0) {
              rafflePosition = Math.floor(Math.random() * MAX);
          }
      
          if (playersTeamOne.length < 5) {
              playersTeamOne.push(raffleMensalist[rafflePosition].name); // Usa `push` para adicionar ao array
              raffleMensalist.splice(rafflePosition, 1); // Usa `splice` para remover o elemento
              continue;
          }
          if (playersTeamTwo.length < 5) {
              playersTeamTwo.push(raffleMensalist[rafflePosition].name);
              raffleMensalist.splice(rafflePosition, 1);
              continue;
          }
          if (playersTeamThree.length < 5) {
              playersTeamThree.push(raffleMensalist[rafflePosition].name);
              raffleMensalist.splice(rafflePosition, 1);
              continue;
          }
          if (playersTeamFour.length < 5) {
              playersTeamFour.push(raffleMensalist[rafflePosition].name);
              raffleMensalist.splice(rafflePosition, 1);
              continue;
          }
      }

      for (let i = 0; i <= tempRaffleGuest; i++) {
        let MAX = raffleGuestList.length - 1;
        let rafflePosition = MAX;
    
        if (MAX !== 0) {
            rafflePosition = Math.floor(Math.random() * MAX);
        }
    
        if (playersTeamOne.length < 5) {
            playersTeamOne.push(raffleGuestList[rafflePosition].name); // Usa `push` para adicionar ao array
            raffleGuestList.splice(rafflePosition, 1); // Usa `splice` para remover o elemento
            continue;
        }
        if (playersTeamTwo.length < 5) {
            playersTeamTwo.push(raffleGuestList[rafflePosition].name);
            raffleGuestList.splice(rafflePosition, 1);
            continue;
        }
        if (playersTeamThree.length < 5) {
            playersTeamThree.push(raffleGuestList[rafflePosition].name);
            raffleGuestList.splice(rafflePosition, 1);
            continue;
        }
        if (playersTeamFour.length < 5) {
            playersTeamFour.push(raffleGuestList[rafflePosition].name);
            raffleGuestList.splice(rafflePosition, 1);
            continue;
        }
    }

   
      
       

        return  res.status(201).send({ team1: playersTeamOne , team2: playersTeamTwo, team3: playersTeamThree, team4: playersTeamFour});;
    })
}