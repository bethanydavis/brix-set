

////////////////////////////////////////////////////////////////////////////////////////////
///////////////      Variables n' stuff ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
			
var realtimeUtils = new utils.RealtimeUtils({
	clientId: '225985226262-jedl3qg3v80e3rl7nrtgab9oqh4oflrv.apps.googleusercontent.com'
});

authorize();

var ourmodel;

var set = {};
set.Card = function(shape, number, shading, color) {
	this.shape = shape;
	this.num = number;
	this.shading = shading;
	this.color = color;
	this.imgUrlString = ((((('images/img' + shape) + number) + shading) + color) + '.png')
	this.imgClickedUrlString = ((((('images/img' + shape) + number) + shading) + color) + '-clicked.png')
}

var first;
var second;
var third;

var gameOver = false;


////////////////////////////////////////////////////////////////////////////////////////////
///////////////      Called anytime     ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function onFileLoaded(doc) {
	window.doc = doc;
	//alert('File loaded.');
	ourmodel = doc.getModel();
	//Listen for changes to cards. 
	var cardList = ourmodel.getRoot().get('cardList');
	cardList.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, updateCardImages);
	cardList.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, updateCardImages);
	
	//var updateString = ourmodel.getRoot().get('updateString');
	//updateString.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, update());

	//Get this player number and increment global number of players
	var playerNumber = ourmodel.getRoot().get('numPlayers');
	playerNumber += 1;
	ourmodel.getRoot().set('numPlayers', playerNumber);
	
	// Add new player to the 'players' map. 
	var scores = ourmodel.getRoot().get('playerScores');
	var playerName = 'Player ' + playerNumber;
	window.doc.playerName = playerName;
	document.getElementById("playerLabel").innerHTML = "<b>" + window.doc.playerName + "</b>";
	scores.set(playerName, 0);
	scores.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, updatePlayers);
	updatePlayers();

	updateCardImages();

	//alert("Players: " + players + ". You are " + player.name + ".");
}

// for up to 3 cards: gets next card from deck, removes from deck, replaces in visible card list at index, updates image
function deal3(a, b, c) {
	//ourmodel.getRoot().set('updateString', 'resetClicks'); 

	var cardList = ourmodel.getRoot().get('cardList');
	var deck = ourmodel.getRoot().get('deck');
	if(deck.length == 0) {
		if (existsSet())
			rearrangeCards(a, b, c);
		return;
	}

	//first card
	var firstOfThree = deck.get(0);
	deck.remove(0);
	var firstValOfThree = [firstOfThree];
	cardList.replaceRange(a, firstValOfThree);
	document.getElementById('card' + a).src=firstOfThree.imgUrlString;


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
	var deck = ourmodel.getRoot().get('deck');
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

function rearrangeCards(a, b, c){
	var cardList = ourmodel.getRoot().get('cardList');
	cardList.set(a, "empty");
	cardList.set(b, "empty");
	cardList.set(c, "empty");

	// Get backmost card
	var backmostCardIndex = 17;
	while (cardList.get(backmostCardIndex) == "empty")
		backmostCardIndex -= 1;
	var emptySlot = 0;
	while (cardList.get(emptySlot) != "empty")
		emptySlot += 1;
	if (emptySlot > backmostCardIndex)
		return;
	
	// Put that card in an empty slot. 
	cardList.set(emptySlot, cardList.get(backmostCardIndex));
	cardList.set(backmostCardIndex, "empty");

	// Get next backmost card
	while (cardList.get(backmostCardIndex) == "empty")
		backmostCardIndex -= 1;
	while (cardList.get(emptySlot) != "empty")
		emptySlot += 1;
	if (emptySlot > backmostCardIndex)
		return;

	// Put that card in an empty slot. 
	cardList.set(emptySlot, cardList.get(backmostCardIndex));
	cardList.set(backmostCardIndex, "empty");

	// Get next backmost card
	while (cardList.get(backmostCardIndex) == "empty")
		backmostCardIndex -= 1;
	while (cardList.get(emptySlot) != "empty")
		emptySlot += 1;
	if (emptySlot > backmostCardIndex)
		return;

	// Put that card in an empty slot. 
	cardList.set(emptySlot, cardList.get(backmostCardIndex));
	cardList.set(backmostCardIndex, "empty");
	//alert('moved card ' + backmostCardIndex + ' to ' + 
}

// Given the cardNum that a user clicks on, set the click value to that index.  If it is the third click,
// check if a set has been selected, and return whether a set has been selected.
function doClick(cardNum) {
	var cardList = ourmodel.getRoot().get('cardList');
	if(first == undefined) {
		first = cardNum;
		updateCardImages();
	}
	else if(second == undefined) {
		second = cardNum;
		updateCardImages();
	}
	else if(third == undefined) {
		third = cardNum;
		if(isSet(first, second, third)) {
			incrementScore(3);
			if (cardList.get(12) != "empty"){ 
				// There are more than 12 cards, so don't deal any more. 
				rearrangeCards(first, second, third);
			} else {
				deal3(first, second, third);
			}
		}	
		resetClicks();
		updateCardImages();
	}
	return false;
}

function resetClicks() {
	first = undefined;
	second = undefined;
	third = undefined;
}

function getMeASet(){
	resetClicks();
	var cardList = ourmodel.getRoot().get('cardList');
	for(var i = 0; i < cardList.length; i++){
		for(var j = 0; j < cardList.length; j++){
			for(var k = 0; k < cardList.length; k++){
				if(isSet(i, j, k)){
					setTimeout(function(){doClick(i)}, 10);
					setTimeout(function(){doClick(j)}, 300);
					setTimeout(function(){doClick(k)}, 600);
					return;
				}
			}
		}
	}
}

function incrementScore(quantity){
	var scores = ourmodel.getRoot().get('playerScores');
	var updatedScore = scores.get(window.doc.playerName);
	updatedScore += quantity;
	scores.set(window.doc.playerName, updatedScore);
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

	var cardList = ourmodel.getRoot().get('cardList');
	
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
	var cardList = ourmodel.getRoot().get('cardList');
	for(var i = 0; i < cardList.length; i++){
		for(var j = 0; j < cardList.length; j++){
			for(var k = 0; k < cardList.length; k++){
				if(isSet(i, j, k)){
					return true;
				}
			}
		}
	}
	return false;
} 

function isGameOver() {
	var cardList = ourmodel.getRoot().get('cardList');
	var deck = ourmodel.getRoot().get('deck');
	return cardList.length == 0 || (deck.length == 0 && !existsSet());
}

function invokeGameOver() {
	gameOver = true;
	var cardList = ourmodel.getRoot().get('cardList');
	for(var i = 0; i < 12; i++) {
		document.getElementById('card' + i).src='images/card.png';
//		document.getElementById('card' + i).hidden="false";
	}
	for(var i = 12; i < 17; i++) {
		document.getElementById('card' + i).hidden="true";
	}
	document.getElementById('card1').src='images/brixcard.png';
	document.getElementById('card5').src='images/setcard.png';
	document.getElementById('card6').src='images/androidcard.png';
}

function requestAdd3(){
	var cardList = ourmodel.getRoot().get('cardList');
	//if (!existsSet()){
		if (cardList.get(12) == "empty")
			deal3(12, 13, 14);
		else if (cardList.get(15) == "empty")
			deal3(15, 16, 17);
	//}
}



////////////////////////////////////////////////////////////////////////////////////////////
///////////////      Called only once    ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function onFileInitialize(model) {
	//alert('Initializing');
	var deck = model.createList();
	var cardList = model.createList();
	var playerScores = model.createMap();
	var updateString = model.createString();
	
	model.getRoot().set('numPlayers', 0);
	model.getRoot().set('deck', deck);
	model.getRoot().set('cardList', cardList);
	model.getRoot().set('playerScores', playerScores);
	model.getRoot().set('updateString', updateString);
	
	
	ourmodel = model;

	startGame();
}

function startGame() {
	var cardList = ourmodel.getRoot().get('cardList'); //visible cards, collab
	var deck = ourmodel.getRoot().get('deck'); //rest of cards - collab
	for(var i = 0; i < 18; i++) {
		cardList.insert(i, "empty");
	}	
	newDeck();
	shuffleDeck();
	deal3(0, 1, 2);
	deal3(3, 4, 5);
	deal3(6, 7, 8);
	deal3(9, 10, 11);
}

function newDeck() {
	var deck = ourmodel.getRoot().get('deck');
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
	//deck.sort(function() { return 0.5 - Math.random() });
}


////////////////////////////////////////////////////////////////////////////////////////////
///////////////      UI Updates         ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// Called when a visible card has changed. 
var updateCardImages = function(){
	if (gameOver)
		return;

	var cardList = ourmodel.getRoot().get('cardList');
	
	for (var i = 0; i < 18; i++){
		var card = cardList.get(i);
		if (card != "empty"){ // There is a card here
			if (first == i || second == i || third == i){
				document.getElementById('card' + i).src=card.imgClickedUrlString;
			} else {
				document.getElementById('card' + i).src=card.imgUrlString;
			}
			document.getElementById('card' + i).hidden=false;
		}	else {
			// card contains "empty", should be hidden.
			document.getElementById('card' + i).hidden=true;
		}
	}
}

var updatePlayers = function(event){
	if (gameOver)
		return;

	var scores = window.ourmodel.getRoot().get('playerScores')
	var infoString = "<b>Players:</b><br><br>";
	var keys = scores.keys();
	for (i = 0; i < keys.length; i++){
		infoString += "<b>" + keys[i] + "</b>: " + scores.get(keys[i]) + "<br>";
	}
	document.getElementById("playerInfo").innerHTML = infoString;
	//alert("Players were updated! " + window.ourmodel.getRoot().get('players'));
};

//called when the collaborative updateString variable changes. 
var update = function(){
	var str = ourmodel.getRoot().get('updateString');
	alert("update: " + str);
	if (str == "resetClicks")
		resetClicks();
	if (str == "invokeGameOver");
		invokeGameOver();
}


////////////////////////////////////////////////////////////////////////////////////////////
///////////////      Auth/Doc Setup     ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function authorize() {
//Attempt to authorize
	realtimeUtils.authorize(function(response){
		if (response.error){
			// Authorization failed because this is the first time the user has used your application, 
			// show the authorize button to prompt them to authorize manually. 
			var button = document.getElementById('authorize_button');
			alert("You must authorize this app.");
			button.disabled=false;
			button.addEventListener('click', function(){
				realtimeUtils.authorize(function(response){
					start();
				}, true);
			});
		} else {
			start();
		}
	}, false);
}
			
function start(){
	//With auth taken care of, load a file, or create one if there is not an id in the URL.
	var id = realtimeUtils.getParam('id');
	if (id){
		// Load the document id from the URL.
		realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
	} else {
		// No id in the URL. Create a new document, add it to the URL.
		realtimeUtils.createRealtimeFile('BrixSet Game', function(response) {
			window.history.pushState(null, null, '?id=' + response.id);
			realtimeUtils.load(response.id, onFileLoaded, onFileInitialize);
		});
	}
}






