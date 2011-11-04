
// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

/**
* Create the multi-context window as startup window that you are going to see when you run the application.
* @method create_and_open_home_window
*/
var create_and_open_home_window = function(){
	var init_window = Ti.UI.createWindow({  
	    title:'USQ Tweet',
	    url: 'home_window.js',
	    backgroundColor:'#ffffff'
	});

	init_window.open();
}

create_and_open_home_window();
