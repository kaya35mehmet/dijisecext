function checkid() {
  Office.onReady(() => {
    isOfficeInitialized = true;
  }).then(function () {
    let body = "";
    Office.context.mailbox.item.body.getAsync("html", async function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        body = result.value;
        document.getElementById("test").innerHTML = body;
        let code = document.getElementsByTagName("span")[0].innerHTML;
        var user = Office.context.mailbox.userProfile.emailAddress;
        document.getElementById("code").innerHTML = code;
        document.getElementById("username").value = user;
        document.getElementById("user").innerHTML = user;
        setTimeout(function () {
          // var code = document.getElementById("code").innerText.trim();
          // getdatabyid(code, user);
        }, 1000);
      }
    });
  });
}
