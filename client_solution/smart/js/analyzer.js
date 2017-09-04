// analyzer.js

var analyzer = {

    parseActions: function () {

    },

    analyzer: {

        openAnalyzer: function () {
            $('#analyzer').removeClass('inactive');
            $('#results').addClass('inactive');
        },

        closeAnalyzer: function () {
            $('#analyzer').addClass('inactive');
            $('#results').removeClass('inactive');
        },

        addFields: function(gembar, dimensions) {
        	var gembarId = "rows"; // rows || columns || measures
			var formulas = [ "[Markets].[Territory]", "[Markets].[Country]" ];
			analyzerApi.report.setLayoutFields(gembarId, formulas);
            analyzerApi.report.setLayoutFields("columns", dimensions);
            analyzerApi.operation.refreshReport();
        }, 

        addFilters: function(filters) {
            analyzerApi.report.setFilters("[Order Status].[Type]", [ {
                "operator" : "EQUAL",
                "members" : [ {
                  "formula" : member,
                  "caption" : filters
                } ]
              } ]);
            analyzerApi.operation.refreshReport();
        },

        removeFilters: function(filters) {
            analyzerApi.report.removeFilters("[Order Status].[Type]");
            analyzerApi.operation.refreshReport();
        },

		addNumericFilters: function(filters) {
		    analyzerApi.report.setNumericFilters("[Markets].[Territory]", [{"count": "10", "formula": "[Measures].[Sales]", "operator": "TOP"}, {"operator": "GREATER_THAN", "formula": "[Measures].[Sales]", "op1": "0.0"}, {"operator": "LESS_THAN", "formula": "[Measures].[Sales]", "op1": "100000000000"}, {"operator": "IS_NOT_EMPTY", "formula": "[Measures].[Sales]"}]);
			analyzerApi.operation.refreshReport();
		},
        
        changeViz: function(viz) {
            analyzerApi.report.setVizId(viz);
            analyzerApi.operation.refreshReport();
        }, 

        refresh: function() {
            analyzerApi.operation.refreshReport();
        },

        reset: function() {
            analyzerApi.operation.resetReport();
        }

    }
};