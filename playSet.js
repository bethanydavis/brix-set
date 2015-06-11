var set = {};

set.Card = function(shape, number, shading, color) {
	this.shape = shape;
	this.num = number;
	this.shading = shading;
	this.color = color;
	this.imgUrlString = ((((('img' + shape) + number) + shading) + color) + '.png')
}

var cardList = document.getModel().get('cardList'); //visible cards, collab
var deck = document.getModel().get('deck'); //rest of cards - collab

var first;
var second;
var third;

// Given the cardNum that a user clicks on, set the click value to that index.  If it is the third click,
// check if a set has been selected, and return whether a set has been selected.
function doClick(cardNum) {
	if(first == undefined) {
		first = cardNum;
	}
	else if(second == undefined) {
		second = cardNum;
		return false;
	}
	else if(third == undefined) {
		third = cardNum;
		if(isSet(first, second, third) {
			incrementScore(3);
			deal3(first, second, third);
			resetClicks();	
			if(isGameOver()){
				invokeGameOver();
			}
		}	
	}
}

function resetClicks() {
	first = undefined;
	second = undefined;
	third = undefined;
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
	var card1 = cardList.get(click1);
	var card2 = cardList.get(click2);
	var card3 = cardList.get(click3);
	
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

// for up to 3 cards: gets next card from deck, removes from deck, replaces in visible card list at index, updates image
function deal3(a, b, c) {
	if(deck.length == 0) {
		return;
	}
	if(deck.length == 1) {
		// can only deal 1 card
		var firstCard = deck.get(0);
		deck.remove(0);
		var value = [firstCard];
		cardList.replaceRange(a, value);
		document.getElementById('card' + a).src=firstCard.imgUrlString;
		return;
	}
	if(deck.length == 2) {
		//can only deal 2 cards

		var oneOfTwo = deck.get(0);
		deck.remove(0);
		var valueOne = [oneOfTwo];
		cardList.replaceRange(a, valueOne);
		document.getElementById('card' + a).src=oneOfTwo.imgUrlString;
		
		
		var twoOfTwo = deck.get(0);
		deck.remove(0);
		var valueTwo = [twoOfTwo];
		cardList.replaceRange(b, valueTwo);
		document.getElementById('card' + b).src=twoOfTwo.imgUrlString;
		return;
	}
	// dealing all 3 cards otherwise:

	//first card
	var firstOfThree = deck.get(0);
	deck.remove(0);
	var firstValOfThree = [firstOfThree];
	cardList.replaceRange(a, firstValOfThree);
	document.getElementById('card' + a).src=oneOfThree.imgUrlString;


	//second card
	var twoOfThree = deck.get(0);
	deck.remove(0);
	var twoValOfThree = [twoOfThree];
	cardList.replaceRange(b, twoValOfThree);
	document.getElementById('card' + b).src=twoOfThree.imgUrlString;

	
	//third card
	var threeOfThree = deck.get(0);
	deck.remove(0);
	var threeValOfThree = [threeOfThree];
	cardList.replaceRange(c, threeValOfThree);
	document.getElementById('card' + c).src=threeOfThree.imgUrlString;
}

function newDeck() {
	var cardIndex = 0;
	//populates each of 81 cards
	for(var i = 1; i < 4; i++) {
		for(var j = 1; j < 4; j++) {
			for(var k = 1; k < 4; k++) {
				for(var m = 1; m < 4; m++) {
					deck.insert(cardIndex, new set.Card(i, j, k, m));
					cardIndex++;
				}
			}
		}
	}
}

function shuffleDeck() {
	deck.sort(function() { return 0.5 - Math.random() });
}

function startGame() {
	newDeck();
	shuffleDeck();
	deal3(0, 1, 2);
	deal3(3, 4, 5);
	deal3(6, 7, 8);
	deal3(9, 10, 11);
}

function incrementScore(quantity){
	var scores = document.getModel().get('playerScores');
	var updatedScore = scores.get(window.doc.playerName);
	updatedScore += quantity;
	scores.set(window.doc.playerName, updatedScore);
}

function invokeGameOver() {
	//should display some sort of game over indication
}


function incrementScore(quantity){
	var scores = window.doc.getModel().getRoot().get('playerScores');
	var updatedScore = scores.get(window.doc.playerName);
	updatedScore += quantity;
	scores.set(window.doc.playerName, updatedScore);
}


