/**
 * local path: http://localhost:83/stats
 * Production server path: http://192.168.2.161/production/ProductionStatistics/stats
 */
var path = "http://192.168.2.161/production/ProductionStatistics/stats";
//var path = "http://localhost:8888/MAMP/ProductionStatistics/stats";

var tableName = "";

$(document).ready(function() {
    // load the statistics
    showGraph();

    $("body").on("click", "li", function() {
        var list = $(this).closest("li");
        switch ((list[0].children[0]).id) {
            case "tTechnical":
                loadData("technical");
                tableName = "technical";
                break;
            case "tServer":
                loadData("server");
                tableName = "server";
                break;
            case "tOffline":
                loadData("offline");
                tableName = "offline";
                break;
        }
    });

    $("body").on("click", "a", function(event) {
        if ($(this).attr("href") === "") {
            event.preventDefault();
            alert("Work in progress");
        }
    });

    $("#searchBox").off("keyup").keyup(function() {
        // get reference to the search input box
        var searchBox = document.getElementById("searchBox");
        showAppsList(searchBox.value);
    });
});

function showAppsList(searchValue) {
    // get the data table
    var dataTable = "";
    dataTable = document.getElementById(tableName);
    // get the rows in the data table
    var dataRow = "";
    dataRows = dataTable.getElementsByTagName("tr");

    // loop through all table rows, and hide those who doesn't match the search query
    for (var i = 1; i < dataRows.length; i++) {
        // get reference to the app name cell
        var nameCell = dataRows[i].getElementsByTagName("td")[1];
        // create a variable for accessing programmer's name cell
        var programmerCell = "";
        if (tableName === "technical" || tableName === "server")
            programmerCell = dataRows[i].getElementsByTagName("td")[6];

        if (nameCell || programmerCell) {
            if (nameCell.innerHTML.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                dataRows[i].style.display = "";
            } else if (programmerCell.innerHTML.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
                dataRows[i].style.display = "";
            } else {
                dataRows[i].style.display = "none";
            }
        }
    }
    console.log(searchValue);
}


/**
 * function fetching the data from the server
 * @param {string} the json file name
 * @returns {JSON} the JSON string
 */
function loadData(fileName) {
    // create an instance of XMLHTTPRequest
    var xmlHttpRequest = new XMLHttpRequest();

    if (!xmlHttpRequest) {
        console.log("Cannot create an instance of XMLHttpRequest");
        return false;
    }

    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
            if (xmlHttpRequest.status === 200) {
                var section = document.getElementById(fileName);
                while (section.firstChild) {
                    section.removeChild(section.firstChild);
                }
                console.log(JSON.parse(xmlHttpRequest.responseText));
                section.appendChild(showData(JSON.parse(xmlHttpRequest.responseText), fileName));
            }
        }
    };
    xmlHttpRequest.open("GET", path + "/" + fileName + ".json", true);
    xmlHttpRequest.send();
}

/**
 * function showing the data in the tabular format
 * @param {jsonString} the data received from the server
 * @returns {table} the table with the data
 */
function showData(jsonString, fileName) {
    // create a table
    var table = document.createElement("table");
    // set the id attribute
    table.setAttribute("id", fileName);
    // set the class attribute to table
    table.setAttribute("class", "table table-bordered table-hover");
    // create table body
    var tBody = document.createElement("tbody");

    // iterate over each object containing the app upload information data
    for (var ctr = 0; ctr < jsonString.length; ctr++) {
        var serialNo = ctr;
        // create table row
        var row = document.createElement("tr");
        // get the app data
        var jsonObject = jsonString[ctr];
        // get the keys of the object at that index
        var keys = Object.keys(jsonObject);

        // iterate over the keys, get the data from each key and put in the table cell
        for (var key = 0; key < keys.length; key++) {
            // create a table cell
            var cell = document.createElement("td");
            // set the class attribute to first row
            if (ctr === 0) {
                cell.setAttribute("class", "bold-text");
            } else if (key === 1 || key === 6) {
                cell.setAttribute("class", "left-text");
            }

            if (ctr > 0 && key === 0)
                cell.innerHTML = serialNo;
            else if (ctr > 0 && key === 8) {
                var link = document.createElement("a");
                if (jsonObject[keys[key]] !== "") {
                    link.setAttribute("href", jsonObject[keys[key]]);
                    link.setAttribute("target", "_blank");
                    link.innerHTML = "See here";
                }
                cell.appendChild(link);
            } else if (ctr > 0 && key === 7) {
                if (jsonObject[keys[key]] !== "") {
                    // create the anchor wrapper
                    var anchor = document.createElement("a");
                    // set the href link
                    anchor.setAttribute("href", jsonObject[keys[key]]);
                    anchor.setAttribute("target", "_blank");
                    // create the span tag
                    var glySpan = document.createElement("span");
                    // set the glyphicon icon
                    glySpan.setAttribute("class", "glyphicon glyphicon-download-alt");

                    // append glyphicon to te anchor
                    anchor.appendChild(glySpan);
                    // append anchor to te cell
                    cell.appendChild(anchor);
                }
            } else
                cell.innerHTML = jsonObject[keys[key]];
            // append the cell to the cell
            row.appendChild(cell);

            //console.log(jsonObject[keys[key]]);
        }
        // append the row to the table body
        tBody.appendChild(row);
    }
    // append the tbody to the table
    table.appendChild(tBody);
    return table;
}

/**
 * function loading the statistics table and the bar chart
 */
function showGraph() {
    //load tde visualization API and the corechart packages
    google.charts.load("current", { "packages": ["bar", "table"] });

    // set a callback to run when tde Google Visualization API is loaded
    google.charts.setOnLoadCallback(drawChart);
    google.charts.setOnLoadCallback(drawTable);

    // Callback tdat creates and populates a data table,
    // instantiates tde pie chart, passes in tde data and
    // draws it
    function drawChart() {
        // Create tde data table
        var data = new google.visualization.arrayToDataTable([
            ["2017", "iOS", "Android"],
            ["Week 1", 3, 3],
            ["Week 2", 2, 4],
            ["Week 3", 1, 2],
            ["Week 4", 3, 1],
            ["Week 5", 1, 0],
            ["Week 6", 1, 1],
            ["Week 7", 1, 4],
            ["Week 8", 5, 2],
            ["Week 9", 3, 3],
            ["Week 10", 1, 3],
            ["Week 11", 2, 3],
            ["Week 12", 2, 4],
            ["Week 13", 2, 3],
            ["Week 14", 3, 4],
            ["Week 15", 3, 0],
            ["Week 16", 3, 1],
            ["Week 17", 3, 0],
            ["Week 18", 0, 0],
            ["Week 19", 1, 1],
            ["Week 20", 0, 0],
            ["Week 21", 1, 2],
            ["Week 22", 2, 4],
            ["Week 23", 5, 1],
            ["Week 24", 1, 1],
            ["Week 25", 1, 1],
            ["Week 26", 0, 0],
            ["Week 27", 0, 0],
            ["Week 28", 1, 1],
            ["Week 29", 0, 0],
            ["Week 30", 0, 0],
            ["Week 31", 1, 1],
            ["Week 32", 1, 0],
            ["Week 33", 0, 1],
            ["Week 34", 0, 0],
            ["Week 35", 1, 1],
            ["Week 36", 1, 2],
            ["Week 37", 1, 1],
            ["Week 38", 2, 1],
            ["Week 39", 2, 2],
            ["Week 40", 1, 1],
            ["Week 41", 1, 1],
            ["Week 42", 0, 0],
            ["Week 43", 1, 1],
            ["Week 44", 1, 0],
            ["Week 45", 1, 1],
            ["Week 46", 0, 0],
            ["Week 47", 0, 0],
            ["Week 48", 0, 0],
            ["Week 49", 0, 0],
            ["Week 50", 0, 0],
            ["Week 51", 0, 0],
            ["Week 52", 0, 0],
            ["Week 1", 0, 0],
            ["Week 2", 1, 0]
        ]);

        // Set Chart options
        var options = {
            chart: {},
            bar: { groupWidth: "10px" }
        };

        //Instantiate and draw our chart, passing in some options.
        var chart = new google.charts.Bar(document.getElementById("chart_div"));
        chart.draw(data, options);
    }

    function drawTable() {
        var tData = new google.visualization.DataTable();
        tData.addColumn("string", "Weeks");
        tData.addColumn("number", "iOS");
        tData.addColumn("number", "Android");

        tData.addRows([
            ["Week 1", 3, 3],
            ["Week 2", 2, 4],
            ["Week 3", 1, 2],
            ["Week 4", 3, 1],
            ["Week 5", 1, 0],
            ["Week 6", 1, 1],
            ["Week 7", 1, 4],
            ["Week 8", 5, 2],
            ["Week 9", 3, 3],
            ["Week 10", 1, 3],
            ["Week 11", 2, 3],
            ["Week 12", 2, 4],
            ["Week 13", 2, 3],
            ["Week 14", 3, 4],
            ["Week 15", 3, 0],
            ["Week 16", 3, 1],
            ["Week 17", 3, 0],
            ["Week 18", 0, 0],
            ["Week 19", 1, 1],
            ["Week 20", 0, 0],
            ["Week 21", 1, 2],
            ["Week 22", 2, 4],
            ["Week 23", 5, 1],
            ["Week 24", 1, 1],
            ["Week 25", 1, 1],
            ["Week 26", 0, 0],
            ["Week 27", 0, 0],
            ["Week 28", 1, 1],
            ["Week 29", 0, 0],
            ["Week 30", 0, 0],
            ["Week 31", 1, 1],
            ["Week 32", 1, 0],
            ["Week 33", 0, 1],
            ["Week 34", 0, 0],
            ["Week 35", 1, 1],
            ["Week 36", 1, 2],
            ["Week 37", 1, 1],
            ["Week 38", 2, 1],
            ["Week 39", 2, 2],
            ["Week 40", 1, 1],
            ["Week 41", 1, 1],
            ["Week 42", 0, 0],
            ["Week 43", 1, 1],
            ["Week 44", 1, 0],
            ["Week 45", 1, 1],
            ["Week 46", 0, 0],
            ["Week 47", 0, 0],
            ["Week 48", 0, 0],
            ["Week 49", 0, 0],
            ["Week 50", 0, 0],
            ["Week 51", 0, 0],
            ["Week 52", 0, 0],
            ["Week 1", 0, 0],
            ["Week 2", 1, 0]
        ]);

        var table = new google.visualization.Table(document.getElementById("chart_table"));
        table.draw(tData, { showRowNumber: true, width: "55%" });
    }
}