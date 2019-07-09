"use strict";
exports.__esModule = true;
var fetch_1 = require("../override/fetch");
var XMLHttpRequest_1 = require("../override/XMLHttpRequest");
function default_1(emit) {
    fetch_1["default"](emit);
    XMLHttpRequest_1["default"](emit);
}
exports["default"] = default_1;
