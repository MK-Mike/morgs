"use strict";
exports.__esModule = true;
var routes_json_1 = require("../../data/routes.json");
var headlands_1 = require("../models/headlands");
var routes = routes_json_1["default"];
function main(data) {
    var headlands = [];
    data.headlands.forEach(function (entry) {
        headlands.push({
            slug: entry.slug,
            name: entry.name,
            description: entry.description
        });
    });
    for (var _i = 0, headlands_2 = headlands; _i < headlands_2.length; _i++) {
        var headland = headlands_2[_i];
        var allHeadlands = (0, headlands_1.insertHeadland)(headland);
        console.log(allHeadlands);
    }
}
main(routes);
