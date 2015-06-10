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
}

// After a file has been initialized and loaded, we can access the document. We will 
// wire up the data model to the UI.
function onFileLoaded(doc) {
}




