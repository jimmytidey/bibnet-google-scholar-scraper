  /*this is a terrible hack and should really be revolved by making the plugin talk directly to the browers */

  serverMessages.listen('serverMessage:info', function (subject, message, options) {

    var subject_array  = subject.split('______'); 
    if(Session.get('current_project') === subject_array) {
      console.log('options', subject_array)
      Notifications.info(subject_array[0], message, options);
    }
  });

  serverMessages.listen('serverMessage:warning', function (subject, message, options) {

    var subject_array  = subject.split('______'); 
    console.log('options', subject_array)
    if(Session.get('current_project') === subject_array[1]) {    
      Notifications.warn(subject, message, options);
    }
  });

  serverMessages.listen('serverMessage:success', function (subject, message, options) {
    var subject_array  = subject.split('______'); 
    console.log('options', subject_array)
    if(Session.get('current_project') === subject_array[1]) {
      Notifications.success(subject, message, options);
    }
  });

  serverMessages.listen('serverMessage:error', function (subject, message, options) {
    console.log('error!');
    clearInterval(window.bibnet_timer);

    var subject_array  = subject.split('______'); 
    console.log('options', subject_array)
    if(Session.get('current_project') === subject_array[1]) {
      Notifications.error(subject_array[0], message, options);
      
    }
  });