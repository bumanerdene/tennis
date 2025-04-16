// tennis point calculator
// game style 
// 1. set 
// - total 6 set
// - each set 0, 15, 30, 40 points and duece for same case
// 2. tiebreak 
// - total point whover reaches 7 and advance in 2 points difference will won 
import Player from "./player"
const TOTAL_SET_TO_PLAY = 6
const DUECE = 3
const ADVANTAGE = 4

type InnerSet = {
    is_duece: boolean;
    player_points:  Record<number, number>;
    winner: Player | null
}
type SetPointArchive = {[set_number: number]: {
    [set_number: number]: InnerSet;
}}
enum Points {
    Love = 0,
    Fifteen = 1,
    Thirty = 2,
    Forty = 3
}
type GameStatus = 'started' | 'delayed' | 'finished';

class Game{
    players: Player[]; 
    winner: number | null;
    status: GameStatus;
    point: Point;
    constructor(player1: Player, player2: Player){
        this.players = [player1, player2];
        this.point = new Point(player1, player2);
        this.winner = null;
        this.status = 'started';
    }
    getGameDetail(){
        return {
            status: this.status,
            mainSet: this.point.getMainSet(),
            subSet: this.point.getCurrentSet(),
            tiebreak: this.point.getTieBreak(),
            players: this.players,
            winner: this.winner,
            pointOverview: this.point.getCurrentPoint(), 
        } 
    } 
} 

class Point{
    main_game_set: number;
    current_set: number;
    set_point_archive: SetPointArchive;
    current_players: Player[];
    is_tie_break: boolean;

    constructor(player1:Player, player2:Player){
        this.main_game_set = 1;
        this.current_set = 1;
        this.is_tie_break = false;
        this.current_players = [player1, player2]
        this.set_point_archive = {}
        this.set_point_archive[this.main_game_set] = {}
        this.set_point_archive[this.main_game_set][this.current_set] = 
        {
            is_duece: false,
            player_points:  {
                [player1.id]: 0,
                [player2.id]: 0
            },
            winner: null
        }
    }
    // getters
    getTieBreak(){
        return this.is_tie_break
    }
    getCurrentPoint(){
        return this.set_point_archive
    }
    getMainSet(){
        return this.main_game_set
    }
    getCurrentSet(){
        return this.current_set
    }

    // main
    increasePoint(player: Player, oponent:Player){
        const current_set_detail = this.set_point_archive[this.main_game_set][this.current_set]
        const current_point = current_set_detail.player_points[player.id]
        if(this.is_tie_break){
            if (current_point >= 7 && current_point >= current_set_detail.player_points[oponent.id] + 2){
                this.endTieBreak();
                this.markTheWinner(player, this.current_set);
            }
            else{
                current_set_detail.player_points[player.id] +=1
            }
            return
        }
        if (current_point == ADVANTAGE) {
            // winner [AD:40]
            current_set_detail.is_duece = false
            this.markTheWinner(player, this.current_set)
            return;
        }
        if(current_point == DUECE && current_set_detail.player_points[oponent.id] < DUECE){
             // winner [40:15]
            this.markTheWinner(player, this.current_set)
            return;
        }
        if(current_point == DUECE && current_set_detail.player_points[oponent.id] == DUECE){
            // Advantage [40:40]
            current_set_detail.player_points[player.id] = ADVANTAGE
            current_set_detail.is_duece = false
            return
        }
        if(current_point == DUECE && current_set_detail.player_points[oponent.id] == ADVANTAGE){
            // Cancel Advantage, set Duece [40:AD] 
            current_set_detail.player_points[oponent.id] = DUECE
            current_set_detail.is_duece = true
            return
        }
        if(current_point == DUECE-1 && current_set_detail.player_points[oponent.id] == DUECE){
            // set Duece [30:40] 
            current_set_detail.player_points[player.id] +=1
            current_set_detail.is_duece = true
            return
        }
        // Normal flow [15:30]
        current_set_detail.player_points[player.id] +=1
        return
    }
    countWinSet(player: Player){
        const total_set_detail = this.set_point_archive[this.main_game_set]
        const winCountByName: Record<string, number> = {};
        for (const setId in total_set_detail) {
            const winner = total_set_detail[setId].winner;
            if (winner) {
              const name = winner.name;
              winCountByName[name] = (winCountByName[name] || 0) + 1;
            }
        }
        return winCountByName[player.name]
    }
    // checkers
    setChecker(){
        const player_set_count = this.countWinSet(this.current_players[0])
        const oponent_set_count = this.countWinSet(this.current_players[1])
        if(player_set_count == oponent_set_count && player_set_count == 6){
            // its tie break
            this.startTieBreak()
        }
        else if(player_set_count == 6 && oponent_set_count < 5){
            this.main_game_set += 1;
            this.current_set = 1;
            return true
        }   
        return false
    }
    isSetTieBreak(){
       
    }

    // actions
    createNewSet(){
        this.current_set += 1;
        this.set_point_archive[this.main_game_set][this.current_set] = 
        {
            is_duece: false,
            player_points:  {
                [this.current_players[0].id]: 0,
                [this.current_players[1].id]: 0
            },
            winner: null
        }
    }
    startTieBreak(){
        this.is_tie_break = true;
    }
    endTieBreak(){
        this.is_tie_break = false;
    }
    markTheWinner(player:Player, current_set:number){
        this.set_point_archive[this.main_game_set][current_set].winner = player
        this.createNewSet()
        this.setChecker()
        return
    }
}


export default Game