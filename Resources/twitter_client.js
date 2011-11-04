Ti.include('lib/sha1.js');
Ti.include('lib/oauth.js');

var twitter_client = function() {

// You will get this key and secret when you create the application in dev.twitter. 
var CONSUMER_KEY = 'kGLnElsmKc2zD92yMqayA';
var CONSUMER_SECRET = 'gz19IYg9YpYkfcM8NJ6RA8hXi3LL623DTfqmIEgLtY';

// those are the twitter REST API Ref https://dev.twitter.com/docs/api
var REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
var AUTHORIZE_URL = 'https://api.twitter.com/oauth/authorize';
var ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
var STATUS_URL = 'http://api.twitter.com/1/statuses/home_timeline.json?true=1';
var UPDATE_URL = 'https://api.twitter.com/1/statuses/update.json';

// the accessor is used when communicating with the OAuth libraries to sign the messages
var accessor = {
    consumerSecret: CONSUMER_SECRET,
    tokenSecret: ''
};

var pin = null;
var oauth_token = null;
var oauth_token_secret = null;

/**
* Returns token. There are two different tokens such as request token and access token. 
* If you call this method after first authentication process, you will get the "request token". Otherwise, "access token"
* @method get_oauth_token
*/
    this.get_oauth_token = function() {
        return oauth_token;
    };

/**
* Returns secret
* @method get_oauth_token_secret
*/
    this.get_oauth_token_secret = function() {
        return oauth_token_secret;
    };

/**
* Returns the URL that we are going to use in 2nd step of authentication.
* @method get_authorize_url_with_token
*/
    this.get_authorize_url_with_token = function() {
        return AUTHORIZE_URL  + '?oauth_token=' + oauth_token;
    };

/**
* Returns pin 
* @method get_pin
*/
    this.get_pin = function() {
        return pin;
    };

/**
* Pass the html text and find the pin from that html text and then set it to the variable. 
* @method get_pin
* @param string html the innerText of html page that returns from twiter after 1st step authentication. We are going to find the pin.
*/
   this.set_pin = function(html){ 

	var regExp = '<code>(.*?)</code>';

        Ti.API.debug('Looking for a PIN [regExp:'+regExp+'].');


        var result = RegExp(regExp).exec(html);
        if (result == null || result.length < 2) {
	   pin = null;
	   Ti.API.debug('Result : ' + result);
           return null;
        }

        Ti.API.debug('Looking for a PIN [pin:'+result[1]+']: done.');

        pin = result[1];

        return pin;
  };

/**
* Initializes the token and secrets. Please uses this method only once you have authenticated the twitter login and saved the "access token" (not "request token")
* @method init
* @param string token access token
* @param string secret oauth token secret
* @pin string pin from twitter
*/
  this.init = function(saved_token, saved_secret, saved_pin){
     oauth_token = saved_token;
     oauth_token_secret = saved_secret;
     pin = saved_pin;
  }

/**
* 3rd step of oAuth. Please refer to this doc https://dev.twitter.com/docs/auth/oauth
* @method access_token
* @param function complete The function callback that will be triggered after the process is completed. Note that the http post is invoked asynchronously (not sync.)
*/
  this.access_token = function(complete) {

	Ti.API.debug('Accessing token');

	accessor.tokenSecret = oauth_token_secret;

	var message = {
            action: ACCESS_TOKEN_URL
            ,
            method: 'POST'
            ,
            parameters: []
        };
        message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
	message.parameters.push(['oauth_token', oauth_token]);
        message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
	message.parameters.push(['oauth_verifier', pin]);

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);
	
	var client = Ti.Network.createHTTPClient();

        client.open('POST', ACCESS_TOKEN_URL, true);
        client.setRequestHeader('Content-Type','application/x-www-form-urlencoded;');		
	client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));	

	client.onload  = function() {  
	         var responseParams = OAuth.getParameterMap(client.responseText);
  	         oauth_token = responseParams['oauth_token'];
                 oauth_token_secret = responseParams['oauth_token_secret'];
		 Ti.API.debug('request token got the following response: ' + client.responseText);
		 Ti.API.debug('oauth_token ' + oauth_token);
		 Ti.API.debug('oauth_token_secret ' + oauth_token_secret);
		 complete.call();
	}

	client.onerror = function(e) {  
		Ti.API.debug('[error]' + this.status + " [text]" + client.responseText);  
	};

        client.send(null);
  };

/**
* 1st step of oAuth. Please refer to this doc https://dev.twitter.com/docs/auth/oauth
* @method request_token
* @param function complete The function callback that will be triggered after the process is completed. Note that the http post is invoked asynchronously (not sync.)
*/
  this.request_token = function(complete) {
	
	Ti.API.debug('Requesting token');

	var message = {
            action: REQUEST_TOKEN_URL
            ,
            method: 'POST'
            ,
            parameters: []
        };

        message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
        message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);
	
	var client = Ti.Network.createHTTPClient();
        client.open('POST', REQUEST_TOKEN_URL, true);
        client.setRequestHeader('Content-Type','application/x-www-form-urlencoded;');		
	client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));	

	client.onload  = function() {  
		Ti.API.debug('[load]' + this.status);  
	         var responseParams = OAuth.getParameterMap(client.responseText);

  	         oauth_token = responseParams['oauth_token'];
                 oauth_token_secret = responseParams['oauth_token_secret'];

		 Ti.API.debug('request token got the following response: ' + client.responseText);
		 Ti.API.debug('oauth_token ' + oauth_token);
		 Ti.API.debug('oauth_token_secret ' + oauth_token_secret);
		
                 if(complete != 'undefined'){
		     Ti.API.debug('Calling the callback from request_token ()');
                     complete();
                 } 
	}

	client.onerror = function(e) {  
		Ti.API.debug('[error]' + this.status + " [text]" + client.responseText);  
	};

        client.send(null);
  };

/**
* Returns the latest tweet (Please refer to https://dev.twitter.com/docs/api/1/get/statuses/home_timeline)
* @method get_home_timelines
* @param function complete The function callback that will be triggered after the process is completed. Note that the http post is invoked asynchronously (not sync.) The response text will be returned in this callback.
*/
  this.get_home_timelines = function(complete){

       accessor.tokenSecret = oauth_token_secret;

       var message = {
            action: STATUS_URL
            ,
            method: 'GET'
            ,
            parameters: []
        };
        message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
	message.parameters.push(['oauth_token', oauth_token]);
        message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

	var client = Ti.Network.createHTTPClient();
	client.open("GET", STATUS_URL, true);
	client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));	

	client.onload  = function() {  
  		 Ti.API.debug('getHomeTimeline - [onload]' + client.responseText);  
  	         complete(client.responseText);
	}

	client.onerror = function(e) {  
		Ti.API.debug('[error]' + this.status + " [text]" + client.responseText);   
	};

        client.send();

	Ti.API.debug('get_home_timelines');

  }; 

/**
* Post the text to twitter. (Please refer to https://dev.twitter.com/docs/api/1/post/statuses/update)
* @method tweet
* @param string text the message that user wants to post to twitter.
* @note this method is not working yet. I already informed my lecture. 
*/

  this.tweet = function(text){

       accessor.tokenSecret = oauth_token_secret;


       var message = {
            action: UPDATE_URL
            ,
            method: 'POST'
            ,
            parameters: []
        };

	Ti.API.debug('oauth_token ' + oauth_token);
	Ti.API.debug('oauth_token_secret ' + oauth_token_secret);
	Ti.API.debug('accessor.consumerSecret ' + accessor.consumerSecret);

        message.parameters.push(['oauth_consumer_key', CONSUMER_KEY]);
	message.parameters.push(['oauth_token', oauth_token]);
        message.parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
        
        message.parameters.push(['status', text]);

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

	var client = Ti.Network.createHTTPClient();
	client.open("POST", UPDATE_URL, true);
        client.setRequestHeader('Content-Type','application/x-www-form-urlencoded;');	
	client.setRequestHeader("Authorization", OAuth.getAuthorizationHeader("", message.parameters));	

	client.onload  = function() {  
  		 Ti.API.debug('tweet - [onload]' + client.responseText);  
	}

	client.onerror = function(e) {  
		Ti.API.debug('[error]' + this.status + " [text]" + client.responseText);   
	};

        var parameterMap = OAuth.getParameterMap(message.parameters);

        //client.send(parameterMap);
	//client.send('status=Maybe%20he%27ll%20finally%20find%20his%20keys.%20%23peterfalk&trim_user=true&include_entities=true');
	client.send();

	Ti.API.debug('tweet-15');
  };
};
