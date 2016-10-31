  serverMessages.listen('serverMessage:info', function (subject, message, options) {
    Notifications.info(subject, message, options);
  });

  serverMessages.listen('serverMessage:warning', function (subject, message, options) {
    Notifications.warn(subject, message, options);
  });

  serverMessages.listen('serverMessage:success', function (subject, message, options) {
    Notifications.success(subject, message, options);
  });

  serverMessages.listen('serverMessage:error', function (subject, message, options) {
    Notifications.error(subject, message, options);
    clearInterval(window.bibnet_timer);
  });