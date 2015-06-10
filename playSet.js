var set = {};

set.Card = function(shape, number, shading, color) {
	this.shape = shape;
	this.num = number;
	this.shading = shading;
	this.color = color;
}

var cardList = []; //visible cards
var deck = []; //rest of cards

var first;
var second;
var third;

// Given the cardNum that a user clicks on, set the click value to that index.  If it is the third click,
// check if a set has been selected, and return whether a set has been selected.
function doClick(cardNum) {
	if(first == undefined) {
		first = cardNum;
		return false;
	}
	else if(second == undefined) {
		second = cardNum;
		return false;
	}
	else if(third == undefined) {
		third = cardNum;
		return isSet();	
	}
	return false;
}

//clicks are ints corresponding to cardList indeces
//retrieve each card and check its properties
function isSet(click1, click2, click3) {
	if(click1 == undefined || click2 == undefined || click3 == undefined) {
		return false;
	}

	//can't click or try identical cards in set
	if(click1 == click2 || click2 == click3 || click3 == click1) {
		return false;
	}
	
	var conditionsMet = true;
	var card1 = cardList[click1];
	var card2 = cardList[click2];
	var card3 = cardList[click3];
	
	var sameColor = (card1.color == card2.color && card2.color == card3.color);
	var diffColor = (card1.color != card2.color && card2.color != card3.color && card1.color != card3.color);
	
	var sameShape = (card1.shape == card2.shape && card2.shape == card3.shape);
	var diffShape = (card1.shape != card2.shape && card2.shape != card3.shape && card1.shape != card3.shape);

	var sameNum = (card1.num == card2.num && card2.num == card3.num);
	var diffNum = (card1.num != card2.num && card2.num != card3.num && card1.num != card3.num);

	var sameShading = (card1.shading == card2.shading && card2.shading == card3.shading);
	var diffShading = (card1.shading != card2.shading && card2.shading != card3.shading && card1.shading != card3.shading);

	conditionsMet = sameColor || diffColor;
	conditionsMet = conditionsMet && (sameShape || diffShape);
	conditionsMet = conditionsMet && (sameNum || diffNum);
	conditionsMet = conditionsMet && (sameShading || diffShading);
	return conditionsMet;
}

//A really inefficient way to check for the existence of a set within the current visible cards
function existsSet() {
	for(var i = 0; i < cardList.length; i++){
		for(var j = 0; j < cardList.length; j++){
			for(var k = 0; k < cardList.length; k++){
				if(isSet(i, j, k){
					return true;
				}
			}
		}
	}
	return false;
} 

function isGameOver() {
	return cardList.length == 0 || (deck.length == 0 && !existsSet());
}


function deal3(a, b, c) {
	if(deck.length == 0) {
		return;
	}
	if(deck.length == 1) {
		// can only deal 1 card
		cardList[a] = deck.shift();
		return;
	}
	if(deck.length == 2) {
		//can only deal 2 cards
		cardList[a] = deck.shift();
		cardList[b] = deck.shift();
		return;
	}
	cardList[a] = deck.shift();
	cardList[b] = deck.shift();
	cardList[c] = deck.shift();
}

function newDeck() {
	var cardIndex = 0;
	//populates each of 81 cards
	for(var i = 1; i < 4; i++) {
		for(var j = 1; j < 4; j++) {
			for(var k = 1; k < 4; k++) {
				for(var m = 1; m < 4; m++) {
					deck[cardIndex] = new set.Card(i, j, k, m);
					cardIndex++;
				}
			}
		}
	}
}

function shuffleDeck() {
	//randomize the deck
}

function startGame() {
	newDeck();
	shuffleDeck();
	deal3(0, 1, 2);
	deal3(3, 4, 5);
	deal3(6, 7, 8);
	deal3(9, 10, 11);
}
