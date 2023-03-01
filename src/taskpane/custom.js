function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function generateQRCode() {
  var office = Office.context.mailbox;

  office.item.to.getAsync(function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      const msgTo = asyncResult.value;
      let website = create_UUID();
      let qrcodeContainer = document.getElementById("qrcode");
      qrcodeContainer.innerHTML = "";

      var qrcode = new QRCode("qrcode", {
        text: website,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      document.getElementById("qrcode-container").style.display = "block";
      const dd = document.getElementById("qrcode");
      var dataUrl = "";
      var touser = "";
      for (let i = 0; i < msgTo.length; i++) {
        touser += msgTo[i].emailAddress + ",";
      }

      if (touser != "") {
        setTimeout(function () {
          url = document.querySelector("#qrcode").querySelector("img").src;
          appendeText =
            "<center> <img src='" +
            url +
            "' alt='"+website+"'> <br /> <stamp id='code'>" +
            website +
            "</stamp> <br /> <br /> <p> <h3><b> Lütfen öncelikle e-postanın doğruluğunu kontrol edin. Daha önce okunmuş e-postalara güvenmeyin! </b></h3></p></center><br/><br/><br/><br/>";
          var user = Office.context.mailbox.userProfile.emailAddress;

          Office.context.mailbox.item.body.prependAsync(
            appendeText,
            { coercionType: Office.CoercionType.Html },
            function () {
              document.getElementById("signform").style.display = "none";
            }
          );
          Office.context.mailbox.item.body.setSignatureAsync(
            appendeText,
            { coercionType: Office.CoercionType.Html },
            function () {
              document.getElementById("signform").style.display = "none";
            }
          );
          var date = new Date();
          addmail(website, user, touser, date);
          office.makeEwsRequestAsync(office.itemId, function (result) {
            const response = $.parseXML(result.value);
            const extendedProps = response.getElementsByTagName("ExtendedProperty");
          });
        }, 1000);
      } else {
        document.getElementById("qrcode").innerHTML = "hedef ekleyin";
      }
    } else {
      console.error(asyncResult.error);
    }
  });
}
