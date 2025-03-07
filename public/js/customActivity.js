define(["postmonger"], function (Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};
  var lastStepEnabled = false;
  var steps = [
    { label: "Step 1", key: "step1" },
    { label: "Step 2", key: "step2" },
    { label: "Step 3", key: "step3" },
    { label: "Step 4", key: "step4", active: false },
  ];
  var currentStep = steps[0].key;

  $(window).ready(onRender);

  connection.on("initActivity", initialize);
  connection.on("clickedNext", onClickedNext);
  connection.on("clickedBack", onClickedBack);
  connection.on("gotoStep", onGotoStep);

  function onRender() {
    connection.trigger("ready");
    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");

    $("#customField").on("input", function () {
      connection.trigger("updateButton", {
        button: "next",
        enabled: Boolean($("#customField").val().trim()),
      });
    });
  }

  function initialize(data) {
    if (data) {
      payload = data;
    }

    var inArguments =
      payload["arguments"]?.execute?.inArguments || [];

    $.each(inArguments, function (index, inArgument) {
      if (inArgument.customField) {
        $("#customField").val(inArgument.customField);
      }
    });

    connection.trigger("updateButton", {
      button: "next",
      enabled: Boolean($("#customField").val().trim()),
    });
  }

  function onClickedNext() {
    if (currentStep.key === "step3" || currentStep.key === "step4") {
      save();
    } else {
      connection.trigger("nextStep");
    }
  }

  function onClickedBack() {
    connection.trigger("prevStep");
  }

  function onGotoStep(step) {
    showStep(step);
    connection.trigger("ready");
  }

  function showStep(step) {
    currentStep = step;
    $(".step").hide();

    switch (currentStep.key) {
      case "step1":
        $("#step1").show();
        break;
      case "step2":
        $("#step2").show();
        break;
      case "step3":
        $("#step3").show();
        break;
      case "step4":
        $("#step4").show();
        break;
    }
  }

  function save() {
    payload["arguments"].execute.inArguments = [
      { customField: $("#customField").val().trim() }
    ];

    payload["metaData"].isConfigured = true;

    connection.trigger("updateActivity", payload);
  }
});
