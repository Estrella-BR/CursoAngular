import { Client } from "../../client/model/Client";
import { Game } from "../../game/model/Game";

export class Loan{
    id: number = 0;
    beginDate: Date = new Date();
    endDate: Date = new Date();
    client: Client  = new Client();
    game: Game = new Game();
}
