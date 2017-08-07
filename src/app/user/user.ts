import { Game } from './game';

export class User {
    constructor(public username: string, public gameList: Game[], public token: string) {}
}
