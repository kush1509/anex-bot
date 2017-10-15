var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '92ff1388-8d30-4df1-b235-d87e792c0cb6',
    appPassword: 'Bjazcfom6gwwZ9cqGt7NADU'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});

var luisAppUrl = 'https://southeastasia.api.cognitive.microsoft.com/luis/v2.0/apps/8c34e164-b525-4ed5-8756-7cf04b89a6c1?subscription-key=a21fcc874a504b558b925c464575cfd5&timezoneOffset=0&verbose=true&q=';
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));

bot.dialog('Welcome intent', [
    function (session) {
            builder.Prompts.text(session, "Hey this is Anex Bot. I'm here to help you manage your expenses. What's your Anex username?");
        },
        // Step 2
	function (session, results) {
	    session.username = results.response;
	    session.save();
	    session.send("Hello " + session.username + "! What do you want to know about your budget?");
	}
])
.triggerAction({
    matches: 'Welcome intent',
})

bot.dialog('Budget', function (session, args) {
    var month = builder.EntityRecognizer.findEntity(args.intent.entities, 'month');
    if(month) {
    	var month = new Date().getMonth();
    	request.get('https://glacial-spire-93148.herokuapp.com/budgets/showBudgetLeft/1/'+ month, function(error,response,body){
            if(error){
                console.log(error);
            } else{
               console.log(response);
               session.send("Your budget for this month is $" + response);
            }
        });
    }
}).triggerAction({
    matches: 'Budget'
});


