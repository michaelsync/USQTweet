Ti.include('isolated_storage.js');
Ti.include('twitter_client.js');

//Get the window instance from another file.
var currentWindow = Ti.UI.currentWindow;
//Create the twitter client instance. 
var client = new twitter_client();

//Create the label that shows "loading" message so user knows that something is happening. 
var loadingLabel = Ti.UI.createLabel({
	text: 'Loading... Please wait.',
});


/**
* Save the token, secret and pin in file. 
* @method save_token_and_secret_in_isolatedstorage
*/
var save_token_and_secret_in_isolatedstorage = function(){
   Ti.API.debug('Saving token and secret in isolated storage. In real dev, you need to encrypt it. ');
   isolated_storage.save_access_token(client.get_oauth_token(), 
		client.get_oauth_token_secret(),
		client.get_pin()); 
}

var redirect_main_window = function() {
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
/**
* This is the 2nd step of oAuth. It will show the twitter authentication page for you to enter user name and password to authorize the app. 
* @method dshow_twitter_on_webview
*/

var show_twitter_on_webview  = function(url, complete) {  
        Ti.API.debug('Showing Twitter WebView');

        var popup_window = Ti.UI.createWindow({
        });


        var view = Ti.UI.createView({
            top: 5,
            width: 310,
            height: 450,
            border: 10,
            backgroundColor: 'white',
            borderColor: '#aaa',
            borderWidth: 5,
        });
        var closeLabel = Ti.UI.createLabel({
            textAlign: 'right',
            font: {
                fontWeight: 'bold',
                fontSize: '8pt'
            },
            text: '(X)',
            top: 10,
            right: 12,
            height: 35
        });
        popup_window.open();

        webView = Ti.UI.createWebView({
            url: url,
            autoDetect:[Ti.UI.AUTODETECT_NONE],
            top:55,
            width: 280,
            height: 350,
        });

        Ti.API.debug('Setting:['+Ti.UI.AUTODETECT_NONE+']');

        
        view.add(webView);

        webView.addEventListener('load', function(e) {
                  Ti.API.debug('loaded');
		  var html = webView.evalJS("document.documentElement.innerHTML"); // need to use this for Andriod. e.source.html works only iOs.
                  //Ti.API.debug(html);
		  client.set_pin(html);
		  
		  Ti.API.debug('client.get_pin() : ' + client.get_pin());
                  
                  if((complete != 'undefined') && (client.get_pin() != null)){
		     Ti.API.debug('Calling the callback from show_twitter_on_webview()');
                     complete();
                  } 
		}
	);


        closeLabel.addEventListener('click', function() { 
		Ti.API.debug('Closing popup.');
		popup_window.close(); 
	} );
        view.add(closeLabel);

        popup_window.add(view);


        return;

};

var login_twitter = function() {
    //Three steps authentication
    //  1. request token
    //  2. show the twitter authentication page to authorize the app. and get the pin
    //  3. get the access token.
    client.request_token(function(){
	    show_twitter_on_webview(
	        client.get_authorize_url_with_token(),
		function(){ 
	            client.access_token(function() {
                       save_token_and_secret_in_isolatedstorage();  
                       redirect_main_window();
                    })
                }
	    )
	    }
	 ); 	
}

currentWindow.add(loadingLabel);

login_twitter();



