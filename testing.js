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

var clipboardDoc = db.collection('clipboards').doc('testing');

var text = clipboardy.readSync();
var history = [];
console.log("Logged in. All set up ...");

setInterval(function() {
	var temp = clipboardy.readSync();
	if(text != temp) {
    clipboardDoc.get().then(doc => {
      var data = doc.data().items;
      // console.log(data);
      if(!hasText(data, temp)) {
        // create new item
        console.log("-----------------------");
        console.log("Sending to Firebase: " + temp);
        console.log("-----------------------");
        var toSend = {text: temp, val: 2};
        data.unshift(toSend);
        clipboardDoc.set({
          items: data
        });
      }else{
        // add 2 to existing item

      }
    });
	}else{
    // clipboardDoc.get().then(doc => {
    //   var data = doc.data().items;
    //   if(hasText(data, temp)) {
    //     console.log("-----------------------");
    //     console.log("Sending to Firebase: " + temp);
    //     console.log("-----------------------");
    //     var toSend = {text: temp, val: 2};
    //     data.unshift(toSend);
    //     clipboardDoc.set({
    //       items: data
    //     });
    //   }
    // });
  }
}, 100)

var observer = clipboardDoc.onSnapshot(function(doc) {
	var data = doc.data().items;
  history = data;

  // fs.writeFile('C://clip.ai.data/dashboard.json', JSON.stringify(history), function(err) {
  //   if(err) throw err;
  //   console.log("File saved");
  // })

  text = predict(history);
  clipboardy.writeSync(text);
  console.log("-----------------------");
  console.log("Generating prediction: " + text);
  console.log("-----------------------\n");
}, function(err) {
	console.log(`Encountered error: ${err}`);
});


function predict(data) {
  var bestValue = -1;
  for(var i = 0; i < data.length; i++) {
    var item = data[i];
    if(item.val > bestValue) {
      bestValue = item.val;
    }
  }

  console.log("Best value:", bestValue);
  if(bestValue == -1) {
    return "";
  }

  for(var i = 0; i < data.length; i++) {
    var item = data[i];
    if(item.val == bestValue) {
      // data.val -= 1;
      // clipboardDoc.set({
      //   items: data
      // });
      return item.text;
    }
  }
}

function hasText(data, key) {
  if(data.length == 0)
    return false;

  for(var i = 0; i < data.length; i++) {
    var item = data[i];
    // console.log("key: ", key, "; Compare: ", item.text);
    if(key == item.text)
      return true;
  }
  console.log('--------------------------\n');
  return false;
}
