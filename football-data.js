(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();
	
	//function init() {tableau.initCallback();}
	//function shutdown() {tableau.shutdownCallback();}
	
	myConnector.getSchema = function(schemaCallback) {
        var fixtureCols = [{
            id: "GameID",
			alias: "Game ID",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "GameDate",
			alias: "Game Date",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "HomeID",
			alias: "Home Team ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "AwayID",
			alias: "Away Team ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "HomeName",
			alias: "Home Team Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "AwayName",
			alias: "Away Team Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "HomeGoals",
			alias: "Home Team Goals",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "AwayGoals",
			alias: "Away Team Goals",
            dataType: tableau.dataTypeEnum.int
		}];
		
		var fixtureSchema = {
            id: "fixture",
            alias: "Fixtures",
            columns: fixtureCols
        };
		
		schemaCallback([fixtureSchema]);
	}
	
    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.ajax({
			headers: {
				"X-Auth-Token": "6d9f35a55daa47fa83dd881ba2fedb4e"
			},
			url: "http://api.football-data.org/v1/fixtures?timeFrame=p30",
			dataType: "json",
			type: "GET",
		}).done(function(response) {
        	var tableData = [];
			
			console.log("Meta data count=" + response.count);
			var regex = /.*?(\d+)$/; // the ? makes the first part non-greedy
			var game, home, away;
			
            // Iterate over the JSON object
            for (var i = 0, len = response.count; i < len; i++) {
				game = regex.exec(response.fixtures[i]._links.self.href);
				home = regex.exec(response.fixtures[i]._links.homeTeam.href);
				away = regex.exec(response.fixtures[i]._links.awayTeam.href);
				
				tableData.push({
                    "GameID": game[1],
                    "Date": response.fixtures[i].date,
                    "HomeID": home[1],
                    "AwayID": away[1],
                    "HomeName": response.fixtures[i].homeTeamName,
                    "AwayName": response.fixtures[i].awayTeamName,
                    "HomeGoals": response.fixtures[i].result.goalsHomeTeam,
					"AwayGoals": response.fixtures[i].result.goalsAwayTeam
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "football-data"; //data source name
            tableau.submit(); //sends  connector object to Tableau
        });
    });
})();
