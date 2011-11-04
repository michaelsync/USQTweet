var isolated_storage = {};

//Name of the file that we are going to use as a Isolated storage. 
var FILE_NAME = 'usqtweet.config';

/**
* Load the token, secret and pin from storage. The application will use this method to determine whether you have authorized the application or not.
* @method load_access_token
*/
isolated_storage.load_access_token = function(){
        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, FILE_NAME);
        if (file.exists == false) {           
	    return null;
        } 

        var contents = file.read();
        if (contents == null) return null;

        try
        {
            var config = JSON.parse(contents.text);
        }
        catch(ex)
        {
            return null;
        }

	return {
 	     'access_token' : config.oauth_token,
 	     'access_token_secret' : config.oauth_token_secret,
             'pin' : config.pin
        }


};

/**
* Save the token, secret and pin in file. 
* @method save_access_token
* @param oauth_token {string}  the access token that twitter provided after 3 steps of authentication. In real application, this shouldn't be stored as a plain format. 
* @param oauth_token_secret {string} 
* @param pin {string} Note: We don't need to re-use pin after authentication but there is no harm to save it.
*/
isolated_storage.save_access_token = function (oauth_token, oauth_token_secret, pin) {
        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, FILE_NAME);

        if (file == null) {
	    file = Ti.Filesystem.createFile(Ti.Filesystem.applicationDataDirectory, FILE_NAME);
	}
        
	file.write(JSON.stringify(
        {
            oauth_token: oauth_token,
            oauth_token_secret: oauth_token_secret,
            pin: pin,
        }
        ));
};


/**
* Delete the token, secret and pin 
* @method delete_access_token
*/

isolated_storage.delete_access_token = function () {
        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, FILE_NAME);

        if (file != null) {
	    file.deleteFile();
	}        
};
