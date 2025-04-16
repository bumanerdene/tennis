import { expect } from "chai";
import Game from "../src/point";
import Player from "../src/player";
describe("When game starts", ()=>{
    it("should return empty data set with equal 0 points", ()=> {
        const player1 = new Player('A', 1)
        const player2 = new Player('B', 2) 
        const game = new Game(player1, player2)
        const expectation_result = game.getGameDetail()
        const mainSet = expectation_result.mainSet
        const subSet = expectation_result.subSet
        console.log('=== POINT=>',expectation_result.pointOverview)
        expect(expectation_result.pointOverview[mainSet][subSet].player_points[player1.id]).to.equal(0)
        expect(expectation_result.pointOverview[mainSet][subSet].player_points[player2.id]).to.equal(0)
        expect( Object.keys(expectation_result.pointOverview).length).to.equal(1)
    })
} )
describe('Test the point system', () => {
    it("should add given players point add correctly", ()=> {
        const player1 = new Player('A', 1)
        const player2 = new Player('B', 2) 
        const game = new Game(player1, player2)
        game.point.increasePoint(player1, player2)
        const expectation_result = game.getGameDetail()
        const mainSet = expectation_result.mainSet
        const subSet = expectation_result.subSet
        expect(expectation_result.pointOverview[mainSet][subSet].player_points[player1.id]).to.equal(1)
    } )
    it("shouldnt add oponent players point", ()=> {
        const player1 = new Player('A', 1)
        const player2 = new Player('B', 2) 
        const game = new Game(player1, player2)
        game.point.increasePoint(player1, player2)
        const expectation_result = game.getGameDetail()
        const mainSet = expectation_result.mainSet
        const subSet = expectation_result.subSet
        expect(expectation_result.pointOverview[mainSet][subSet].player_points[player2.id]).to.equal(0)
    } )
    it("should mark duece when set point 40 40", ()=> {
        const player1 = new Player('A', 1)
        const player2 = new Player('B', 2) 
        const game = new Game(player1, player2)
        game.point.increasePoint(player1, player2) // 15
        game.point.increasePoint(player2, player1) // 15
        game.point.increasePoint(player1, player2) // 30
        game.point.increasePoint(player2, player1) // 30
        game.point.increasePoint(player1, player2) // 40
        game.point.increasePoint(player2, player1) // 40
        const expectation_result = game.getGameDetail()
        const mainSet = expectation_result.mainSet
        const subSet = expectation_result.subSet
        expect(expectation_result.pointOverview[mainSet][subSet].is_duece).to.equal(true)
    } )
    it("should mark cancel duece when advantage", ()=> {
        const player1 = new Player('A', 1)
        const player2 = new Player('B', 2) 
        const game = new Game(player1, player2)
        game.point.increasePoint(player1, player2) // 15
        game.point.increasePoint(player2, player1) // 15
        game.point.increasePoint(player1, player2) // 30
        game.point.increasePoint(player2, player1) // 30
        game.point.increasePoint(player1, player2) // 40
        game.point.increasePoint(player2, player1) // 40
        game.point.increasePoint(player2, player1) // AD
        const expectation_result = game.getGameDetail()
        const mainSet = expectation_result.mainSet
        const subSet = expectation_result.subSet
        expect(expectation_result.pointOverview[mainSet][subSet].is_duece).to.equal(false)
    } )
    it("should cancel advantage and set duece again", ()=> {
        const player1 = new Player('A', 1)
        const player2 = new Player('B', 2) 
        const game = new Game(player1, player2)
        game.point.increasePoint(player1, player2) // 15
        game.point.increasePoint(player2, player1) // 15
        game.point.increasePoint(player1, player2) // 30
        game.point.increasePoint(player2, player1) // 30
        game.point.increasePoint(player1, player2) // 40
        game.point.increasePoint(player2, player1) // 40
        game.point.increasePoint(player2, player1) // AD
        game.point.increasePoint(player1, player2) // AD
        const expectation_result = game.getGameDetail()
        const mainSet = expectation_result.mainSet
        const subSet = expectation_result.subSet
        console.log(expectation_result.pointOverview[mainSet][subSet])
        expect(expectation_result.pointOverview[mainSet][subSet].is_duece).to.equal(true)
    } )
    it("should mark winner from advantage", ()=> {
        const player1 = new Player('A', 1)
        const player2 = new Player('B', 2) 
        const game = new Game(player1, player2)
        
        game.point.increasePoint(player1, player2) // 15
        game.point.increasePoint(player2, player1) // 15
        game.point.increasePoint(player1, player2) // 30
        game.point.increasePoint(player2, player1) // 30
        game.point.increasePoint(player1, player2) // 40
        game.point.increasePoint(player2, player1) // 40
        game.point.increasePoint(player2, player1) // AD
        game.point.increasePoint(player1, player2) // DUECE
        game.point.increasePoint(player1, player2) // AD

        const expectation_result = game.getGameDetail()
        const subSet = expectation_result.subSet

        game.point.increasePoint(player1, player2) // Winner
        const mainSet = expectation_result.mainSet
        const new_set = game.getGameDetail().subSet

        expect(expectation_result.pointOverview[mainSet][subSet].is_duece).to.equal(false)
        expect(expectation_result.pointOverview[mainSet][subSet].winner).to.equal(player1)
        expect(new_set).to.equal(subSet+1)

    } )
    it("should start tiebreak", ()=> {
        const player1 = new Player('A', 1)
        const player2 = new Player('B', 2) 
        const game = new Game(player1, player2)

        game.point.startTieBreak()
        game.point.increasePoint(player1, player2) // 1
        game.point.increasePoint(player1, player2) // 1
        game.point.increasePoint(player1, player2) // 1
        game.point.increasePoint(player1, player2) // 1
        game.point.increasePoint(player1, player2) // 1

        const expectation_result = game.getGameDetail()
        const mainSet = expectation_result.mainSet
        const subSet = expectation_result.subSet


        expect(expectation_result.pointOverview[mainSet][subSet].player_points[player1.id]).to.equal(5)
        expect(expectation_result.pointOverview[mainSet][subSet].player_points[player2.id]).to.equal(0)

    } )
    it("should mark winner when player point reaches 7", ()=> {
        const player1 = new Player('A', 1)
        const player2 = new Player('B', 2) 
        const game = new Game(player1, player2)

        game.point.startTieBreak()
        game.point.increasePoint(player1, player2) // 1
        game.point.increasePoint(player1, player2) // 1
        game.point.increasePoint(player1, player2) // 1
        game.point.increasePoint(player1, player2) // 1
        game.point.increasePoint(player1, player2) // 1

        game.point.increasePoint(player2, player1) // 1

        game.point.increasePoint(player1, player2) // 1
        game.point.increasePoint(player1, player2) // 1

        const expectation_result = game.getGameDetail()
        const mainSet = expectation_result.mainSet
        const subSet = expectation_result.subSet

        game.point.increasePoint(player1, player2) // Winner
        const new_expected_result = game.getGameDetail()

        expect(expectation_result.pointOverview[mainSet][subSet].player_points[player1.id]).to.equal(7)
        expect(expectation_result.pointOverview[mainSet][subSet].player_points[player2.id]).to.equal(1)
        expect(expectation_result.pointOverview[mainSet][subSet].winner).to.equal(player1)
        expect(new_expected_result.tiebreak).to.equal(false)
        expect(new_expected_result.subSet).to.equal(subSet+1)

    } )
} )