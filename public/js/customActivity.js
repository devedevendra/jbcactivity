define(["postmonger"], function (Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};

  $(window).ready(onRender);

  connection.on("initActivity", initialize);

  function onRender() {
    connection.trigger("ready");
    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");
  }

  function initialize(data) {
    if (data) {
      payload = data;
    }

    // Directly make the callout when the activity is initialized
    makeCallout();
  }

  function makeCallout() {
    var url = "https://sfmc-example-jb-custom-activity-3mrh.onrender.com/journeybuilder/execute";

    // Perform the REST callout to the external endpoint
    $.ajax({
      url: url,
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({ /* No input needed, send an empty payload or relevant data */ }),
      success: function(response) {
        // Handle the response if needed
        console.log("Callout successful", response);
      },
      error: function(xhr, status, error) {
        // Handle errors if needed
        console.error("Error during callout", error);
      }
    });
  }
});
