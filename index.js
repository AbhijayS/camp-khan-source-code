var fs = require('fs');
var admin = require("firebase-admin");
const clipboardy = require('clipboardy');
require('dotenv').config();

var serviceAccount = require("./keys/" + process.env.serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://clip-ai.firebaseio.com"
});

var db = admin.firestore();

admin.firestore().settings({timestampsInSnapshots: true});

var clipboardDoc = db.collection('clipboards').doc('clipboard');

var text = clipboardy.readSync();
var history = [];
console.log("Logged in. All set up ...");

setInterval(function() {
	var temp = clipboardy.readSync();
	if(text != temp) {
    clipboardDoc.get().then(doc => {
      var data = doc.data().items;
      if(!data.includes(temp)) {
        console.log("-----------------------");
        console.log("Sending to Firebase: " + temp);
        console.log("-----------------------");
        data.unshift(temp);
        clipboardDoc.set({
          items: data
        });
      }
    });
	}
}, 100);

var observer = clipboardDoc.onSnapshot(function(doc) {
	var data = doc.data().items;
  history = data;

  fs.writeFile('C://clip.ai.data/dashboard.json', JSON.stringify(history), function(err) {
    if(err) throw err;
    console.log("File saved");
  })

  text = predict(history);
  clipboardy.writeSync(text)
  console.log("-----------------------");
  console.log("Generating prediction: " + text);
  console.log("-----------------------\n");
	// clipboardy.writeSync(predict(history));
}, function(err) {
	console.log(`Encountered error: ${err}`);
});


function predict(data) {
  if(data.length == 0) {
    return "";
  }
  return data[0];
}
