/*
 * Create the popup window for help file viewer. 
 * The help file is written in html so the WebView control
 * is being used for viewing that html file.
 */
var popup_window = Ti.UI.createWindow({
            modal: true,
            fullscreen: true
    });

// Create a view with border 
var view = Ti.UI.createView({
    top: 5,
    width: 310,
    height: 450,
    border: 10,
    backgroundColor: 'white',
    borderColor: '#aaa',
    borderWidth: 5,
});

//Create a lable as a "Close" button for popup window.
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

closeLabel.addEventListener('click', function() { 
	Ti.API.debug('Closing popup.');	
	
	popup_window.close(); 

	var init_window = Ti.UI.createWindow({  
		    title:'USQ Tweet',
		    url: 'home_window.js',
		    backgroundColor:'#ffffff'
		});

	init_window.open();
} );
view.add(closeLabel);

popup_window.open();

//Create a webview to display the help file. 
webView = Ti.UI.createWebView({
    url: './help/index.html',
    autoDetect:[Ti.UI.AUTODETECT_NONE],
    top:55,
    width: 280,
    height: 350,
});


view.add(webView);
popup_window.add(view);
