function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
var touser = [];
function setsecure() {
  var secure = document.getElementById("secure").checked;
  if (secure) {
    var office = Office.context.mailbox;
    office.item.to.getAsync(function (asyncResult) {
      const msgTo = asyncResult.value;
      for (let i = 0; i < msgTo.length; i++) {
        var phone = getuser(msgTo[i].emailAddress);

        // const para = document.createElement("div");
        // if (phone != 0) {
        //   para.innerHTML =
        //     " <label for='fname'>" +
        //     msgTo[i].emailAddress +
        //     "</label><input type='text' id='fname' name='firstname' value='" +
        //     phone +
        //     "' placeholder='Telefon numarası girin'>";
        // } else {
        //   para.innerHTML =
        //     " <label for='fname'>" +
        //     msgTo[i].emailAddress +
        //     "</label><input type='text' id='fname' name='firstname' value='' placeholder='Telefon numarası girin'>";
        // }

        touser.push(msgTo[i].emailAddress);
      }

      if (touser.length > 0) {
        document.getElementById("divphonenumber").style.display = "block";
      } else {
        document.getElementById("secure").checked = false;
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        modal.getElementsByClassName("modal-body")[0].innerHTML = "<h3>Hedef ekleyin</h3>";
      }
    });
  } else {
    document.getElementById("divphonenumber").style.display = "none";
    document.getElementById("divphonenumber2").innerHTML = "";
  }
}

function stampla() {
  var modal = document.getElementById("myModal2");
  modal.style.display = "block";

  // generateQRCode();
}

function generateQRCode() {
  closemodal("myModal2");
  var secure = document.getElementById("secure").checked;
  var office = Office.context.mailbox;

  office.item.to.getAsync(function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      let body = "";
      let website = create_UUID();
      if (secure) {
        website = "732873-" + website;
        Office.onReady(() => {
          isOfficeInitialized = true;
        }).then(function () {
          Office.context.mailbox.item.body.getAsync("html", async function (result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
              body = result.value;
              Office.context.mailbox.item.body.setAsync(
                "<center><img src='https://dijisec.com/assets/stamp.png' width='100'/><br> Lütfen içeriği görmek için E-Stamp eklentisini ya da mobil uygulamasını kullanın.</center><br/><center>E-Stamp eklentisinin kullanımı için lütfen <a src='https://dijisec.com' target='_blank'>https://dijisec.com</a> adresini ziyaret edin.</center>",
                { coercionType: Office.CoercionType.Html }
              );
            }
          });
        });
      }
      const msgTo = asyncResult.value;

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
      var touser = [];
      for (let i = 0; i < msgTo.length; i++) {
        touser.push(msgTo[i].emailAddress);
      }

      if (touser != "") {
        setTimeout(function () {
          url = document.querySelector("#qrcode").querySelector("img").src;
          appendeText =
            "<center> <stamp id='code'>" +
            website +
            "</stamp> <br /> <img src='" +
            url +
            "'/> <br /> <p> <h3><b> Lütfen öncelikle e-postanın doğruluğunu kontrol edin. Daha önce okunmuş e-postalara güvenmeyin! </b></h3></p></center><br/><br/><br/><br/>";
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
          var receiverid = "";
          if (secure) {
            addsecuremail(website, user, touser, date, body, receiverid);
          } else {
            addmail(website, user, touser, date);
          }
          office.makeEwsRequestAsync(office.itemId, function (result) {
            const response = $.parseXML(result.value);
            const extendedProps = response.getElementsByTagName("ExtendedProperty");
          });
        }, 1000);
      } else {
        var modal = document.getElementById("myModal");
        modal.style.display = "block";
        modal.getElementsByClassName("modal-body")[0].innerHTML = "<h3>Hedef ekleyin</h3>";
        document.getElementById("qrcode").innerHTML = "";
      }
    } else {
      console.error(asyncResult.error);
    }
  });
}
