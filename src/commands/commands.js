function check() {
  Office.onReady(() => {
    isOfficeInitialized = true;
  }).then(function () {
    let body = "";
    Office.context.mailbox.item.body.getAsync("html", function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        body = result.value;
        //  let code = body.getElementById("code");
        document.getElementById("test").innerHTML = body;
        let code = document.getElementsByTagName("span")[0].innerHTML;
        document.getElementById("test2").innerHTML = code;
      }
    });
  });
}
