define(["postmonger"], function (Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};

  $(window).ready(onRender);
  connection.on("initActivity", initialize);
  connection.on("clickedNext", save);

  function onRender() {
    connection.trigger("ready");
  }

  function initialize(data) {
    if (data) payload = data;

    var inArguments = payload.arguments?.execute?.inArguments || [];
    var customField = inArguments.find(arg => arg.customField)?.customField || "";
    
    $("#customInput").val(customField);
  }

  function save() {
    var customFieldValue = $("#customInput").val().trim();
    payload.arguments.execute.inArguments = [{ customField: customFieldValue }];
    payload.metaData.isConfigured = true;
    connection.trigger("updateActivity", payload);
  }
});
