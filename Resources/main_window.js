Ti.include('twitter_client.js');
Ti.include('isolated_storage.js');

var currentWindow = Ti.UI.currentWindow;

var client = Ti.UI.currentWindow.custom_data;

var timeline_label = Titanium.UI.createLabel({
			text:'Timeline (loading...)',
			left:5,
			top: 120,
			textAlign:'left',
			color:'#000000',
			font:{fontFamily:'Trebuchet MS',fontSize:16,fontWeight:'bold'}
		});

currentWindow.add(timeline_label); 


var show_time_line = function(text) {
        Ti.API.debug('I am in show_time_line.');

	var rowData = [];
    	var tweets = eval('('+text+')');

        Ti.API.debug('tweets.length .' + tweets.length);

	for (var i = 0; i < tweets.length; i++)
	{
		var tweet = tweets[i].text; // The tweet message
		var user = tweets[i].user.screen_name; // The screen name of the user
		var avatar = tweets[i].user.profile_image_url; // The profile image
		var src = tweets[i].source;
		var created_at = tweets[i].created_at;
		// Create a row and set its height to auto
		var row = Titanium.UI.createTableViewRow({height:'auto'});

		Ti.API.debug('user : ' + user);

		// Create the view that will contain the text and avatar
		var message_view = Titanium.UI.createView({
			height:'auto', 
			layout:'vertical',
			top:5,
			right:5,
			bottom:5,
			left:5
		});

		// Create image view to hold profile pic
		var profile_image = Titanium.UI.createImageView({
			url:avatar, // the image for the image view
			top:0,
			left:0,
			height:48,
			width:48
		});
		message_view.add(profile_image);

		// Create the label to hold the screen name
		var screen_name_lable = Titanium.UI.createLabel({
			text:user,
			left:54,
			width:120,
			top:-48,
			bottom:2,
			height:16,
			textAlign:'left',
			color:'#444444',
			font:{fontFamily:'Trebuchet MS',fontSize:14,fontWeight:'bold'}
		});
		message_view.add(screen_name_lable);

		// Create the label to hold the tweet message
		var tweet_label = Titanium.UI.createLabel({
			left:54,
			top:2,
			bottom :2,
                        height:'auto',
			width:236,
			textAlign:'top',
			font:{fontSize:14}
		});

		tweet_label.text = tweet;

		message_view.add(tweet_label);

		// Add the post view to the row
		row.add(message_view);

		// Add row to the rowData array
		rowData[i] = row;
	}

	// Create the table view and set its data source to "rowData" array
	var tableView = Titanium.UI.createTableView({
		data:rowData,
                borderWidth : 2,
		borderColor : '#000000',
                backgroundColor : '#ffffff',
                height : 270, 
                top:155,
		left:5,
		right:5
	});


	//Add the table view to the window
	currentWindow.add(tableView);
    
	timeline_label.text = 'Timeline';
        Ti.API.debug('I am in show_time_line.[end]');
};

var tweetTextArea = Titanium.UI.createTextArea({
    hintText:'What\'s happending?',
    height:70,
    width:310,
    top:5,
    left:6,
    textAlign:'left'  
});

var words_count_label = Titanium.UI.createLabel({
			text:'140 word(s) remaining. ',
			left:6,
			top: 75,
			textAlign:'left'
		});

currentWindow.add(words_count_label); 

//stupid : http://developer.appcelerator.com/question/126502/maxlength-on-textarea#comment-102343
tweetTextArea.addEventListener('change', function(e){
    if(e.value.length > 140) {
        var alertDialog = Titanium.UI.createAlertDialog({
	    title: 'USQTweet',
	    message: 'You cannot type more than 140 character!',
	    buttonNames: ['OK']
	});
	alertDialog.show();
	tweetTextArea.value = e.value.substr(0,140);
    }
    else{
	words_count_label.text = 140 - e.value.length + ' word(s) remaining. ';
    }	
});

currentWindow.add(tweetTextArea);

var tweetButton = Ti.UI.createButton({
   title: 'Tweet',
   height:45,  
   width:100, 
   top:75,
   left:200,
   align:'right'
});

tweetButton.addEventListener('click',function(e)
{ 
	client.tweet(tweetTextArea.value);
});


currentWindow.add(tweetButton); 

var logout_button = Ti.UI.createButton({
   title: 'Log out',
   height:45,  
   width:100, 
   top:435,
   left:5,
   align:'right'
});


logout_button.addEventListener('click',function(e)
{ 
	isolated_storage.delete_access_token();

	var init_window = Ti.UI.createWindow({  
	    title:'USQ Tweet',
	    url: 'home_window.js',
	    backgroundColor:'#ffffff'
	});

	init_window.open();
});

currentWindow.add(logout_button);

Ti.API.debug('client : ' + client);


client.get_home_timelines(function(responseText) {  
  show_time_line(responseText);
});



 Ti.API.debug('Main Window is opened. 14');
