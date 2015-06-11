// Create a new instance of the realtime utility with your client ID.
			
var realtimeUtils = new utils.RealtimeUtils({
	clientId: '225985226262-jedl3qg3v80e3rl7nrtgab9oqh4oflrv.apps.googleusercontent.com'
});

authorize();


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

// The first time a file is opened, it must be initialized with the document structure.
// This function will add a collaborative string to our model at the root. 
function onFileInitialize(model) {
	//alert('Initializing');
	var deck = model.createList();
	var cardList = model.createList();
	var playerScores = model.createMap();
	
	model.getRoot().set('numPlayers', 0);
	model.getRoot().set('deck', deck);
	model.getRoot().set('cardList', cardList);
	model.getRoot().set('playerScores', playerScores);

	startGame();
}

// After a file has been initialized and loaded, we can access the document. We will 
// wire up the data model to the UI.
function onFileLoaded(doc) {
	window.doc = doc;
	//alert('File loaded.');

	//Listen for changes to cards. 
	var cardList = document.getModel().get('cardList');
	cardList.addEventListener(gapi.drive.realtime.EventType.VALUE_ADDED, updateCardImage);
	cardList.addEventListener(gapi.drive.realtime.EventType.VALUE_SET, updateCardImage);
	
	//Get this player number and increment global number of players
	var playerNumber = doc.getModel().getRoot().get('numPlayers');
	playerNumber += 1;
	doc.getModel().getRoot().set('numPlayers', playerNumber);

	// Add new player to the 'players' map. 
	var scores = doc.getModel().getRoot().get('playerScores');
	var playerName = 'Player ' + playerNumber;
	window.doc.playerName = playerName;
	document.getElementById("playerLabel").innerHTML = "<b>" + window.doc.playerName + "</b>";
	scores.set(playerName, 0);
	scores.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, updatePlayers);
	updatePlayers();

	//alert("Players: " + players + ". You are " + player.name + ".");
}

// Called when a visible card has changed. 
var updateCardImage = function(index){
	var cardList = document.getModel().get('cardList');
	var card = cardList.get(index);
	document.getElementById('card' + index).src=card.imgUrlString;
}

var updatePlayers = function(event){
	var scores = window.doc.getModel().getRoot().get('playerScores')
	var infoString = "<b>Players:</b><br><br>";
	var keys = scores.keys();
	for (i = 0; i < keys.length; i++){
		infoString += "<b>" + keys[i] + "</b>: " + scores.get(keys[i]) + "<br>";
	}
	document.getElementById("playerInfo").innerHTML = infoString;
	//alert("Players were updated! " + window.doc.getModel().getRoot().get('players'));
};



