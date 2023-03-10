function username() {
  Office.onReady(() => {
    isOfficeInitialized = true;
  }).then(function () {
    var user = Office.context.mailbox.userProfile.emailAddress;
    document.getElementById("username").innerText = user;
  });
}
