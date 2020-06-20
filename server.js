//Install express server
const express = require('express');
const path = require('path');
const app = express();


var options = {};

var server = require('http').Server(app);
var io = require('socket.io')(server);


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});


var orderBy = require('lodash.orderby');




let players = [];
let roundPlayers = [];
var numOfPlayers = 0;
let host = {};
let scoreboard = [];

let hitPile = [];
let hitBase;

let isLobbyDisabled = false;

let cards = {};
let bets = [];
let currentRound = 1;
let modifier = 0;
let roundBets = [];
let isLastRound = false;

let betsRevealed = false;
let roundPointsAllocated = false;




io.on("connection", socket => {    
    // On landing
    socket.on('landing', (id) => {
        console.log(id);
        socket.id = id;
        socket.emit('playerCount', numOfPlayers);
    });
    // when the client emits 'add user', this listens and executes
    socket.on('add new user', (user) => {
        console.log('Trying to add new user . . .');
        console.log(user);
        
        if (!isLobbyDisabled) {
            ++numOfPlayers;
            addedUser = true;
            host = numOfPlayers === 1 ? Object.assign({}, user) : host;
            user = { ...user, isHost: numOfPlayers === 1 };
            players.push(user);
    
            socket.emit('joining lobby', { user, players });
            io.emit('playerCount', numOfPlayers);
            socket.broadcast.emit('user joined', user);
            socket.id = user.uniqueId;
            console.log('Added ' + user.username + ' to the game');
        } else {
            console.log('Game started cant add user');
            socket.emit('joining lobby', 401);
        }
    });
    socket.on('override user', player => {
        console.log('Overriding user: ', player)
        const patchedPlayerInd = players.findIndex(user => user.uniqueId === player.uniqueId);
        players[patchedPlayerInd] = Object.assign({}, player);
        socket.emit('joining lobby', { player, players });
        console.log('Added ' + user.username + ' back to the game');
    });
    socket.on('get lobby players', () => {
        socket.emit('lobby players', players);
    });
    socket.on('update player', player => {
        console.log('Updating player', player.uniqueId);
        const ind = players.findIndex(user => user.uniqueId === player.uniqueId);
        // check for icon change
        if (player.iconTitle !== players[ind].iconTitle) {
            players[ind].iconTitle = player.iconTitle;
        }
        // check for readiness change
        if (player.isReady !== players[ind].isReady) {
            players[ind].isReady = player.isReady;
        }
        socket.broadcast.emit('player updated', {id : player.uniqueId, player});
    });
    // AUTH0
    socket.on('is auth', id => {
        if (isLobbyDisabled) {
            console.log('is authorized to go in');
            socket.emit('can log in', players.findIndex(player => player.uniqueId === id) > -1) ;
        } else {
            socket.emit('can log in', true);
        }
    });
    // GAME STARTS
    socket.on('start game', () => {
        isLobbyDisabled = true;
        // set up round 1
        setUpFirstRound(currentRound);
        socket.broadcast.emit('go to game');
    });
    socket.on('get current round', () => {
        socket.emit('current round is', currentRound);
    });
    socket.on('get round data', (data) => {
        const roundData = getRoundData(data);
        socket.emit('round data', {roundData, isLastRound});
    });
    // Betting
    socket.on('making a bet', (bet) => {
        if (bet.isDealerBet) {
            const betInd = roundBets.findIndex(roundBet => bet.uniqueId === roundBet.uniqueId);
            roundBets.splice(betInd, 1);
            roundBets.push(bet);
            const playerInd = roundPlayers.findIndex(player => player.uniqueId === bet.uniqueId);
            roundPlayers[playerInd].bets = Object.assign({}, bet);
            if (currentRound === 1 || isLastRound) {
                const firstRoundData = getFirstRoundResults();
                // socket.broadcast.emit('play out first round', {firstRoundData, isDealerChangeNeeded, options});
                io.emit('play out edge round', {firstRoundData, isDealerChangeNeeded, options});
                // if (isLastRound) {
                //     resetEverything();
                // }
            } else {
                // socket.broadcast.emit('reveal bets', {roundBets, isDealerChangeNeeded: false, options: []});
                betsRevealed = true;
                io.emit('reveal bets', {roundBets, isDealerChangeNeeded: false, options: []});    
            }
        } else {
            // adding bet
            console.log('adding bet', bet);
            roundBets.push(bet);
            const playerInd = roundPlayers.findIndex(player => player.uniqueId === bet.uniqueId);
            roundPlayers[playerInd].bets = Object.assign({}, bet);
            console.log('bet was made');
            console.log(roundBets);
            socket.broadcast.emit('diff player made a bet', bet);
            console.log(roundPlayers);
            // what if sum is wrong
            if (roundBets.length === roundPlayers.length) {
                const isDealerChangeNeeded = dealerNeedsToChange(roundBets);
                let options = [];
                if (isDealerChangeNeeded) {
                    const dealerBet = getDealer().bets;
                    options = getDealer().bets.bettingOptions.filter(bet => bet !== dealerBet.bet);
                }
                if (currentRound === 1) {
                    const firstRoundData = getFirstRoundResults(isDealerChangeNeeded);
                    // socket.broadcast.emit('play out first round', {firstRoundData, isDealerChangeNeeded, options});
                    io.emit('play out edge round', {firstRoundData, isDealerChangeNeeded, options});
                    roundBets = [];
                } else {
                    // socket.broadcast.emit('reveal bets', {roundBets, isDealerChangeNeeded, options});
                    betsRevealed = true;
                    io.emit('reveal bets', {roundBets, isDealerChangeNeeded, options});
                }
            }
        }
    });
    // Play cards
    socket.on('card played', (card) => {
        console.log('yeeet');
        const winnerId = playCard(card);
        if (winnerId !== undefined) {
            console.log('hit win or round end');
            if (cards.players[0].hand.length === 0) {
                // end of the round allocate points
                console.log('Winner of round is being declared');
                allocatePoints(roundPlayers);
                roundPointsAllocated = true;
                io.emit('round finished', {scoreboard, roundBets, lastCard: card})
                // socket.broadcast.emit('round finished', {scoreboard, roundBets, lastCard: card})
                console.log({scoreboard, roundBets, lastCard: card});
            } else {
                // meaning there is a winner for this hit
                // tell people the winnerId and roundBets
                console.log('Hit winner is declared');
                // socket.broadcast.emit('hit winner is', {winnerId});
                io.emit('hit winner is', {winnerId});
                console.log({winnerId});
            }
        } else {
            // tell people somebody played a card
            // and next playter to go
            console.log('Somebody played a card');
            const nextId = getNextToPlayId(card.uniqueId);
            socket.broadcast.emit('somebody played card', {card, nextId});
            console.log({card, nextId});
        }
     });
    // Init next round
    socket.on('set up next round', () => {
        currentRound++;
        if (currentRound > (51 / roundPlayers)) {
            modifier -= 2;
        }
        setUpNextRound(currentRound + modifier);
        isLastRound = modifier < 0 && currentRound + modifier === 1;
        console.log('Round setup');
        console.log(roundPlayers);
        console.log(cards);
        io.emit('start next round', currentRound);
    });
    // Init next round
    socket.on('new game same players', () => {
        resetToLobbyStage();
        socket.emit('lobby players', players);  
    });
    socket.on('quit', () => {
        resetEverything();
    });
});

server.listen(4444, function() {
    console.log('Lets go!');
});


// Server reset and quitting methods

function resetToLobbyStage() {
    resetGameData();
    resetLobbyPlayers();
};
function resetGameData() {
    cards = [];
    bets = [];
    roundPlayers = [];
    scoreboard = [];
}

function resetLobbyPlayers() {
    players.forEach(playa => {
        playa.iconTitle = 'Male';
        playa.isReady = false;
    })
}


function resetEverything() {
    roundPlayers = [];
    numOfPlayers = 0;
    host = {};
    scoreboard = [];
    hitPile = [];
    players = [];
}
function getNextToPlayId(prevId) {
    if (!prevId) {
        return -1;
    }
    let prevSeatInd = roundPlayers.find(player => player.uniqueId === prevId).seatInd;
    let newSeatInd;
    const playerLen = roundPlayers.length;
    if (prevSeatInd + 1 === playerLen) {
        newSeatInd = 0;
    } else {
        newSeatInd = prevSeatInd + 1;
    }
    return roundPlayers.find(player => player.seatInd === newSeatInd).uniqueId;
}
function playCard(card) {
    let winnerId;
    // handle base
    if (hitPile.length === 0) {
        hitBase = Object.assign({}, card);
    }
    // play card and remove from player hand
    hitPile.push(card);
    const playerInd = cards.players.findIndex(player => player.uniqueId === card.uniqueId);
    const cardInd = cards.players[playerInd].hand.findIndex(playerCard =>
        playerCard.value === card.value &&
        playerCard.suit === card.suit);
    cards.players[playerInd].hand.splice(cardInd, 1);

    if (roundPlayers.length === hitPile.length) {
        // last of hit -> allocate hit and set them as next
        winnerId = getHitResult();
    }
    console.log('winner id is ', winnerId);
    return winnerId;
}
function getHitResult() {
    console.log('gettting hit results');
    let winnerId = 0;
    const trumps = hitPile.filter(card => card.suit === cards.trump.suit);
    const baseCards = hitPile.filter(card => card.suit === hitBase.suit);
    console.log(hitPile);
    console.log(trumps);
    console.log(baseCards);
    
    if (trumps.length > 0) {
        winnerId = getMaxIdv2(trumps);
    } else {
        winnerId = getMaxIdv2(baseCards);
    }
    console.log(winnerId);
    // alloc hits
    const winnerInd = roundPlayers.findIndex(player => player.uniqueId === winnerId);
    const betWinnerInd = roundBets.findIndex(player => player.uniqueId === winnerId);
    console.log(winnerInd);
    console.log(roundPlayers);
    console.log(roundBets);
    roundPlayers[winnerInd].bets.hits++;
    roundBets[betWinnerInd].hits++;
    hitPile = [];
    return winnerId;
}
function getRoundData(data) {
    let roundData = {};
    // myHand
    roundData.myHand = {
        myHand: [],
        firstRoundHand: []
    };
    if (data.round === 1) {
        roundData.myHand.firstRoundHand = getRoundHand(data);
    } else {
        roundData.myHand.myHand = getRoundHand(data);
    }
    console.log(roundData.myHand);
    // myBets
    const userBetInd = bets.findIndex(bet => bet.uniqueId === data.id);
    roundData.myBets = bets[userBetInd];
    // other players
    roundData.players = roundPlayers.filter(player => player.uniqueId !== data.id);
    roundData.trumpCard = cards.trump;
    // me
    roundData.me = roundPlayers.find(player => player.uniqueId === data.id);

    // roundstage
    roundData.roundStage = getRoundStage(data);
    return roundData;
}
function getRoundStage(data) {
    const stage = getStage();
    switch (stage) {
        case 'betting':
            // check if user already made a bet or nah
            console.log(roundBets);
            console.log(data);
            return { stage, madeBet: roundBets.findIndex(bet => bet.uniqueId === data.id) !== -1};
        case 'playing':
            // send out nextId and pile
            return { stage, nextId: getNextToPlayId(hitPile[hitPile.length - 1].uniqueId), hitPile};
        case 'results':
            // get the points
            return {stage, results: { scoreboard, roundBets }};
        default:
            return {stage};
    }
}
function getStage() {
    if (roundPointsAllocated) {
        return 'results';
    } else if (betsRevealed) {
        return 'playing';
    } else {
        return 'betting';
    }
}
function getFirstRoundResults(isDealerChangeNeeded) {
    if (isDealerChangeNeeded) {
        return {
            winnerId: -1,
            scoreboard: {},
            seatIndOrder: [],
            roundBets: [],
            cards: []
        };
    }
    // create order index for seats to be playing
    const seatIndOrder = getSeatIndOrder();
    console.log(seatIndOrder);
    const baseHandId = roundPlayers.find(player => player.seatInd === seatIndOrder[0]).uniqueId;
    const base = cards.players.find(player => player.uniqueId === baseHandId);
    console.log(base);
    const pile = [];
    let winnerId;
    // get hands
    seatIndOrder.forEach(seatInd => {
        const handId = roundPlayers.find(player => player.seatInd === seatInd).uniqueId;
        const currentHand = cards.players.find(player => player.uniqueId === handId);
        pile.push(currentHand);
    });
    const trumps = pile.filter(card => card.hand[0].suit === cards.trump.suit);
    const baseCards = pile.filter(card => card.hand[0].suit === base.hand[0].suit);
    if (trumps.length > 0) {
        winnerId = getMaxId(trumps);
    } else if (baseCards.length > 0) {
        winnerId = getMaxId(baseCards);
    }
    console.log('winner: ', winnerId);
    // allocate hit
    const winnerInd = roundPlayers.findIndex(player => player.uniqueId === winnerId);
    const betWinnerInd = roundBets.findIndex(player => player.uniqueId === winnerId);
    roundPlayers[winnerInd].bets.hits++;
    roundBets[betWinnerInd].hits++;
    // allocate points
    console.log(scoreboard);
    allocatePoints(roundPlayers);
    console.log(scoreboard);
    return {
        winnerId,
        scoreboard,
        seatIndOrder,
        roundBets,
        cards: cards.players
    }
}
function allocatePoints(users) {
    users.forEach(playa => {
        const sbInd = scoreboard.findIndex(user => user.uniqueId === playa.uniqueId);
        console.log(`allocating points for ${sbInd}`);
        scoreboard[sbInd].points += getRoundPoint(playa);
    });
}
function getRoundPoint(user) {
    const diff = Math.abs(user.bets.bet - user.bets.hits);
    console.log(`diff of ${user.bets.bet} and ${user.bets.hits} is ${diff}`);
    if (diff === 0) {
        return (10 + (diff * 2));
    } else {
        return (diff * (-2));
    }
}
function getMaxIdv2(pile) {
    let winnerId;
    let currentMaxVal = 0;
    console.log(pile);
    pile.forEach(card => {
        console.log(card);
        console.log(currentMaxVal);
        if (card.value > currentMaxVal) {
            currentMaxVal = card.value;
            winnerId = card.uniqueId;
        }
    });
    return winnerId;
}
function getMaxId(pile) {
    let winnerId;
    let currentMaxVal = 0;
    pile.forEach(hand => {
        if (hand.hand[0].value > currentMaxVal) {
            currentMaxVal = hand.hand[0].value;
            winnerId = hand.uniqueId;
        }
    });
    return winnerId;
}
function getSeatIndOrder() {
    const out = [];
    const playerLen = roundPlayers.length;
    let currentInd = roundPlayers.find(player => player.isFirst).seatInd;
    out.push(currentInd);
    console.log('curr ind: ', currentInd);
    for (var i = 0; i < playerLen - 1; i++) {
        console.log(currentInd + 1 === playerLen);
        console.log(currentInd + 1);
        console.log(playerLen);
        
        if (currentInd + 1 === playerLen) {
            currentInd = 0;
        } else {
            currentInd++;
        }
        out.push(currentInd);
    }
    return out;
}
function getDealer() {
    const dealerInd = roundPlayers.findIndex(player => player.isDealer);
    console.log(dealerInd);
    console.log(roundPlayers);
    return roundPlayers[dealerInd];
}
function dealerNeedsToChange(bets) {
    let accum = 0;
    bets.forEach(betObj => {
        console.log(betObj.bet);
        accum = accum + betObj.bet;
    });

    return bets.length === roundPlayers.length
        && accum === currentRound;
}
function getRoundHand(data) {
    if (data.round === 1) {
        const hands = [];
        cards.players.filter(player => player.uniqueId !== data.id).forEach(player => {
            hands.push(cards.players.filter(user => user.uniqueId === player.uniqueId)[0]);
        });
        return hands;
    } else {
        const ind = cards.players.findIndex(player => player.uniqueId === data.id);
        return cards.players[ind];
    }
}
function setUpNextRound(cardsToDeal) {
    // modifier should be set here already
    // deal new cards
    cards = Object.assign({}, initCards(players));
    cards = Object.assign({}, dealCards(cards, cardsToDeal));
    cards = Object.assign({}, dealTrumpCard(cards));
    // reset bets
    bets = initBets(players, cardsToDeal);
    roundBets = [];
    betsRevealed = false;
    roundPointsAllocated = false;

    // players needs to update
    const prevDealerSeatInd = roundPlayers.find(player => player.isDealer).seatInd;
    const nextDealerSeatInd = prevDealerSeatInd + 1 === roundPlayers.length ? 0 : prevDealerSeatInd + 1;
    const nextFirstSeatInd = nextDealerSeatInd + 1 === roundPlayers.length ? 0 : nextDealerSeatInd + 1;
    roundPlayers.forEach(player => {
        player.bets = bets.find(bet => bet.uniqueId === player.uniqueId);
        player.status = 'Still betting...';
        player.isReady = false;
        player.isDealer = nextDealerSeatInd === player.seatInd;
        player.isFirst = nextFirstSeatInd === player.seatInd;
    });
}
function setUpFirstRound(currentRound) {
    cards = Object.assign({}, initCards(players));
    cards = Object.assign({}, dealCards(cards, currentRound));
    cards = Object.assign({}, dealTrumpCard(cards));
    bets = initBets(players, currentRound);
    roundPlayers = initPlayers(players);
    scoreboard = Array.from(initScoreboard(roundPlayers));
    console.log(cards);
}
function initScoreboard(users) {
    const out = [];
    users.forEach(user => {
        out.push({
            uniqueId: user.uniqueId,
            name: user.username,
            points: 0
        });
    })
    return out;
}
function initPlayers(players) {
    const hostInd = players.findIndex(player => player.isHost === true);
    players.forEach((player, ind, arr) => {
        player.bets = {bet: 0, hits: 0};
        player.status = 'Still betting...';
        player.seatInd = ind;
        player.isDealer = player.isHost;
        player.isFirst = (ind === hostInd + 1) ? true : false;
        player.isReady = false;
    });
    return players;
}
function initBets(players, round) {
    const array = [];
    players.forEach(player => {
        let options = [];
        for (var i = 0; i <= round; i++) {
            options.push(i);
        }

        array.push({
            uniqueId: player.uniqueId,
            bet: 0,
            hits: 0,
            bettingOptions: options
        });
    });
    return array;
}
function dealCards(cards, numCards) {
    cards.players.forEach(player => {
        const ind = cards.players.findIndex(user => user.uniqueId === player.uniqueId);
        for (let i = 0; i < numCards; i++) {
            cards = dealCardTo(ind, cards);
        }
        cards.players[ind].hand = Array.from(getOrderedCards(cards.players[ind].hand));
    });
    return cards;
}
function getOrderedCards(arrOfCards) {
    const hearts = orderBy(arrOfCards.filter(card => card.suit === 'heart'), ['value'], ['desc']);
    const diamonds = orderBy(arrOfCards.filter(card => card.suit === 'diamond'), ['value'], ['desc']);
    const spades = orderBy(arrOfCards.filter(card => card.suit === 'spade'), ['value'], ['desc']);
    const clubs = orderBy(arrOfCards.filter(card => card.suit === 'club'), ['value'], ['desc']);
    return hearts.concat(diamonds, spades, clubs);
}
function dealCardTo(ind, cards) {
    const stuff = getRandomInt(0, cards.deck.length - 1);

    cards.players[ind].hand.push(cards.deck[stuff]);
    cards.deck.splice(stuff, 1);

    return cards;
}
function dealTrumpCard(cards) {
    let isValidTrump = false;
    let stuff = 0;
    while (!isValidTrump) {
        stuff = getRandomInt(0, cards.deck.length);
        isValidTrump = cards.deck[stuff] !== undefined;
    }

    cards.trump = cards.deck[stuff];
    cards.deck.splice(stuff, 1);

    return cards;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function initCards(players) {
    let out = {
        deck: [],
        players: []
    };
    // Deck Init
    const suits = getSuits();
    for (let i = 2; i <= 10; i++) {
        out.deck = out.deck.concat( generateCards(String(i), i, suits) );
    }
    out.deck = out.deck.concat( generateCards('J', 11, suits) );
    out.deck = out.deck.concat( generateCards('Q', 12, suits) );
    out.deck = out.deck.concat( generateCards('K', 13, suits) );
    out.deck = out.deck.concat( generateCards('A', 14, suits) );
    out.deck = Array.from(shuffle( out.deck ));
    // Players Init
    players.forEach(player => {
        out.players.push({
            uniqueId: player.uniqueId,
            hand: []
        });
    });
    return out;
}
function getSuits() {
    return {
        club: 'club',
        diamond: 'diamond',
        heart: 'heart',
        spade: 'spade'
    }
}
function generateCards(name, value, suits) {
    let suitedCards = [];
    [
        suits.club,
        suits.diamond,
        suits.heart,
        suits.spade
    ].forEach(suit => {
        suitedCards.push({
            name: name,
            value: value,
            suit: suit
        });
    });
    return suitedCards;
}
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}