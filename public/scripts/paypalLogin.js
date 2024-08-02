const paypalApiScript = document.createElement("script");
paypalApiScript.src = "https://www.paypalobjects.com/js/external/api.js";
paypalApiScript.onload = function () {
  paypal.use(["login"], function (login) {
    login.render({
      appid:
        "AasW1Pd3tdAhHSJN1LBV5JTmjx99aSoONOzY82Z3BqXhdk-3yKSNshguS_CK0DwBqCsJeQMeQQQSOPg2",
      scopes: "https://uri.paypal.com/services/paypalattributes",
      containerid: "paypal-connect",
      responseType: "code",
      locale: "en-gb",
      buttonType: "LWP",
      buttonShape: "pill",
      buttonSize: "lg",
      fullPage: "true",
      returnurl: "https://selina.d.yeducoders.com/dashboard/profile-edit/",
    });
  });
};

document.body.appendChild(paypalApiScript);
