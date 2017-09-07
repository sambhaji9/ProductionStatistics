// load the required modules
var fileSystem = require("fs");
var sqlite3 = require("sqlite3");

fileSystem.readFile("./stats/technical.json", "utf-8", (err, data) => {

    if (err)
        console.log(err);

    var techData = eval(data);
    console.log(techData[1]);

    let db = new sqlite3.Database("./exportDatabase.db", (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to the database");
    });

    var dataLength = techData.length;

    for (var i = 1; i < dataLength; i++) {
        db.run('insert into technical(serialNo, appName, appVersion, onlineDate, appType, platform, programmer, backup, details) values(?,?,?,?,?,?,?,?,?)', [i, techData[i].appName, techData[i].appVersion, techData[i].onlineDate, techData[i].appType, techData[i].platform, techData[i].programmer, techData[i].backup, techData[i].details], (err) => {
            if (err) {
                return console.error(err.message);
            } else {
                console.log("Data inserted successfully " + i);
            }
        });
    }


    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Close the database connection");
    });
});