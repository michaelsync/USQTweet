Ti.include('isolated_storage.js');
Ti.include('twitter_client.js');

//Get the instance of current window from different file.
var init_window = Ti.UI.currentWindow;

//Create the logo with yellow border 
var image_top = Titanium.UI.createImageView({
	    url:'./images/home_top.png',
	    top: 1,
	    left:0,
	    width:320
	   });

init_window.add(image_top);

init_window.orientationModes = [
	Titanium.UI.PORTRAIT,
	Titanium.UI.UPSIDE_PORTRAIT,
	Titanium.UI.LANDSCAPE_LEFT,
	Titanium.UI.LANDSCAPE_RIGHT
    ];

//Try loading the token from file. The return value will be null if there is nothing in Isolated storage.
var saved_config = isolated_storage.load_access_token();

Ti.API.debug('Loading access token: done [saved_config:] ' + saved_config);

var title = 'Add your twitter account';

//If we found the token in isolated storage (meaning that user has authorized our app once.), change the title.
if(saved_config != null) {
   title = 'Open your twitter account';
}

var login_button = Ti.UI.createButton({
   title: title,
   height:55,  
   width:250, 
   top:220,
});

var client = new twitter_client();
/**
* Create and open the login window
* @method create_and_open_login_window
*/
var create_and_open_login_window = function() {
        Ti.API.debug('Opening Main Window');
	var loginWindow = Ti.UI.createWindow({  
	    title:'USQ Tweet',
	    url: 'login_window.js',
	    backgroundColor:'#fff'
	});

	loginWindow.orientationModes = [
		Titanium.UI.PORTRAIT,
		Titanium.UI.UPSIDE_PORTRAIT,
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT
	    ];

	loginWindow.open();
};

/**
* Create and open the main window where you can see the latest tweets.
* @method create_and_open_main_window
*/
var create_and_open_main_window = function() {
	Ti.API.debug('Opening Main Window');

	var main_window = Ti.UI.createWindow({  
	title:'USQ Tweet',
	url: 'main_window.js',
	backgroundColor:'#ffffff',
	custom_data:client
	});

	main_window.orientationModes = [
	Titanium.UI.PORTRAIT,
	Titanium.UI.UPSIDE_PORTRAIT,
	Titanium.UI.LANDSCAPE_LEFT,
	Titanium.UI.LANDSCAPE_RIGHT
	];

	main_window.open();
}


login_button.addEventListener('click',function(e)
{   
	if(saved_config == null) {
		create_and_open_login_window();
	}
	else{
		client.init(saved_config.access_token, 
					saved_config.access_token_secret,
					saved_config.pin);
		create_and_open_main_window();
	}
});

init_window.add(login_button);

var help_button = Ti.UI.createButton({
   title: 'Help',
   height:50,  
   width:65, 
   left:250,
   top:420,
});

help_button.addEventListener('click',function(e)
{   
	var help_window = Ti.UI.createWindow({  
	    title:'USQ Tweet',
	    url: 'help.js',
	    backgroundColor:'#fff'
	  });

	help_window.orientationModes = [
		Titanium.UI.PORTRAIT,
		Titanium.UI.UPSIDE_PORTRAIT,
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT
	    ];

	help_window.open();	
});

init_window.add(help_button);

var image_bottom = Titanium.UI.createImageView({
    url:'./images/home_bottom.png',
    top: 470,
    left:0,
    width:320
   });

init_window.add(image_bottom);
