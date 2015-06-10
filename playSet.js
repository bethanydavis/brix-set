var set = {};

var set.Card = function(shape, number, shading, color) {
	this.shape = shape;
	this.num = number;
	this.shading = shading;
	this.color = color;
}

var cardList[];
var visibleCards[];

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




