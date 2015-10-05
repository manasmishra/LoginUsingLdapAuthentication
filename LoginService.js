//include ldapjs 
var ldap = require('ldapjs');
var session		=	require('express-session');
var bodyParser  	= 	require('body-parser');
var express = require('express');
var app = express();
//define  global variables
var BLUEPAGE_LDAP_SERVER_URL = 'ldaps://xxxxxx.yyy.com:port';
var BLUEPAGE_BASE_DN = 'ou=xxxxxxx,o=yyy.com';
var BLUEPAGE_AUTHENTICATED = false;

var DN='';
var firstItem=true;
//For maintaining a session
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
//used to parse JSON body that is being posted from UI
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
//Declared to store a session
var sess;
//connect to LDAP Server

// Performs a search operation against the LDAP server
//Login Service for company internet Id/Password authentication
app.post('/rest/v1/Login',authenticate);

function authenticate(req,res) {
	var intranetId = req.body.intranetId;
	var password = req.body.password;
	sess = req.session;
	var ldapClientUrl = {url:BLUEPAGE_LDAP_SERVER_URL};
	//Ldap client is created
	var client = ldap.createClient(ldapClientUrl);

	
	//creating a filter for searching LDAP and getting the username
	var opts = {
		filter: '(&(objectclass=yyyperson)(mail='+intranetId+'))',
		scope: 'sub',
		attributes: ['uid']
	};
	
	//Search for user ID for validation
	client.search(BLUEPAGE_BASE_DN, opts, function(err, resp) {
		if(err){
			console.log(err);
			sendResponse(res, "Login", "Could not establish connection with the server", 2000, "OK", 11, "");
		}
		else{
			resp.on('searchEntry', function(entry) {
				if(entry.object){
					var UID = entry.object;
					console.log(UID);
					DN = UID.dn ;
					console.log('DN: ' + DN);
				}
			});
			resp.on('error', function(error) {
				console.error('error: ' + error.message);
			});
			resp.on('end', function(entry) {
				client.bind(DN, password, function(err) {
					if (err)
					{
						DN ='';
						sendResponse(res, "Login", "Login Failed", 2000, "OK", 11, "");
					}
					else
					{
						DN='';
						sess.intranetId = intranetId;
						sendResponse(res, "Login", "Login Executed sucessfully", 200, "OK", 0, "") 
					}
				});
				client.unbind(function(error){
					if(error){
						console.log(error.message);
					} else{
						console.log('client disconnected');
					}
				});
			});
		}
	});
}//end of bluepageAuthenticate  function*/
app.delete('/rest/v1/Logout',function(req,res){
	sess= req.session;
	console.log(sess.intranetId);
	if(sess.intranetId!=null){
		console.log("user is exiting. going to remove session");
		
	}
	req.session.destroy();
	sendResponse(res, "Logout", "Logout Successful", 200, "OK", 0, "Logged Out and session has been destroyed");
});
function sendResponse(res, serviceName, message, restCode, restMsg, retCode, retBody) {

    res.writeHead(restCode, { "Content-Type" : "application/json" });
	var serviceResponse = serviceName+"Response";
	var output ={	LoginResponse://To Do here the key should be shown dynamically
					{	 
						ResponseBody: retBody, 
						TimeStamp : new Date(), 
						ReturnCode:retCode,
						Message: message, 
						RestStatusCode: restCode,
						RestStatusMessage : restMsg
					}
				};
    res.end(JSON.stringify(output) + "\n");
} 
app.listen(8080);
console.log("Server is runnign on http://localhost:8080");
