sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.kt.sapproject.controller.View1", { 
            onInit: function() {
                this.refreshCaptcha();
            },
            
            onRefreshCaptcha: function() {
                this.refreshCaptcha();
            },
            
            refreshCaptcha: function() {
                // Generate new Captcha
                var sCaptcha = this.generateRandomString(6); 
                this.getView().byId("captchaText").setValue(sCaptcha);
            },
            
            generateRandomString: function(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },
            
            onLoginPress: function() {
                var text7 = this.getView().getModel("i18n").getResourceBundle().getText("title7")
            
                var oView = this.getView();
                var oNameInput = oView.byId("nameInput");
                var oIDInput = oView.byId("idInput");
                var oCaptchaInput = oView.byId("captchaInput");
                var oCaptchaText = oView.byId("captchaText");
                
                var name = oNameInput.getValue().trim();
                var ID = oIDInput.getValue().trim();
                var captchaInput = oCaptchaInput.getValue().trim();
                var captchaText = oCaptchaText.getValue().trim();
            
                var bValid = true;
            
                // Name validation
                if (name === "") {
                    oNameInput.setValueState("Error");
                    oNameInput.setValueStateText("Enter name.");
                    bValid = false;
                } else {
                    oNameInput.setValueState("None");
                }
            
                // ID validation
                if (ID === "") {
                    oIDInput.setValueState("Error");
                    oIDInput.setValueStateText("Please enter your ID.");
                    bValid = false;
                } else if (!/^\d+$/.test(ID)) {  
                    oIDInput.setValueState("Error");
                    oIDInput.setValueStateText("ID should be numeric.");
                    bValid = false;
                } else {
                    oIDInput.setValueState("None");
                }
            
                // Captcha validation
                if (captchaInput === "") {
                    oCaptchaInput.setValueState("Error");
                    oCaptchaInput.setValueStateText("Please enter the captcha.");
                    bValid = false;
                } else if (captchaInput !== captchaText) {
                    oCaptchaInput.setValueState("Error");
                    oCaptchaInput.setValueStateText("Captcha is incorrect.");
                    bValid = false;
                } else {
                    oCaptchaInput.setValueState("None");
                }
            
                if (!bValid) {
                    return;
                }
        
                var oModel = this.getOwnerComponent().getModel();
                var sPath = "/Persons";
            
                oModel.oHeaders.DataServiceVersion = '3.0';
                oModel.oHeaders.MaxDataServiceVersion = '3.0';
           
                oModel.read(sPath, {
                    filters: [new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.EQ, name),
                    new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, ID) ],
                    success: function(oData) {
                        console.log("Success Response:", oData);
                        
                        if (oData.results.length > 0) {
                            var user = oData.results[0];
            
                            var oRouter = this.getOwnerComponent().getRouter();
                            if (user.__metadata.type === "ODataDemo.Customer") {
                                oRouter.navTo("RouteView2");
                            } else if (user.__metadata.type === "ODataDemo.Employee") {
                                sap.m.MessageToast.show("User not found");
                            } else {
                                oRouter.navTo("RouteView4");
                            }
                        } else {
                            sap.m.MessageToast.show(text7);
                        }
                    }.bind(this),
                    error: function(oError) {
                        console.log("Error:", oError);
                        sap.m.MessageToast.show("Error: " + oError.message);
                    }
                });
            }
            
            
            });
          });