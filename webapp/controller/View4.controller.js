sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.sap.kt.sapproject.controller.View4", { 
        onInit: function() {
            this.localModel = [];
            var oModel = new sap.ui.model.json.JSONModel(this.localModel);
            this.getView().setModel(oModel, "localModel");

            this.generatecategory();
              
        },

        generatecategory:function(){
            var oModel = this.getOwnerComponent().getModel();

            oModel.oHeaders.DataServiceVersion = '3.0';
            oModel.oHeaders.MaxDataServiceVersion = '3.0';

            oModel.read("/Categories", {
                success: function(odata) {
                    console.log(odata);
                    var jsondata = new sap.ui.model.json.JSONModel(odata.results);
                    this.getView().setModel(jsondata, "jsondata1");
                }.bind(this),
                error: function(error) {
                    console.error("Error reading Categories: " + error);
                }
            });
        },

        handlePress: function (oEvent) {
            var sPath = oEvent.getSource().getBindingContext("jsondata1").getObject().ID;
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView5", {
                ID: sPath
            });
        },
        onClickOk3: function () {
            var oView = this.getView();
        
            if (!this.oDia) {
                this.oDia = sap.ui.core.Fragment.load({
                    name: "com.sap.kt.sapproject.fragment.create",
                    controller: this
                }).then(function (oDia) {
                    this.oDia = oDia;
                    oView.addDependent(this.oDia);
                    this.oDia.open();
                    var ID = this.byId("listID").getItems().length + 1;
                    var input = sap.ui.getCore().byId("id1");
                    if (input) {
                        input.setValue(ID);
                    } 
                }.bind(this));
            } else {
                this.oDia.open();
                sap.ui.getCore().byId("id1").setValue("");
                sap.ui.getCore().byId("name").setValue("");
            }
        },
        
        onPressSave: function () {
            var text1 = this.getView().getModel("i18n").getResourceBundle().getText("title1")
            var text2 = this.getView().getModel("i18n").getResourceBundle().getText("title2")
            
            var sName = sap.ui.getCore().byId("name").getValue();
            if (sName === "") {
                sap.ui.getCore().byId("name").setValueState("Error");
                sap.ui.getCore().byId("name").setValueStateText("Enter the value");
            } else {
                var ID = this.byId("listID").getItems().length + 1;
                var oModel = this.getOwnerComponent().getModel();
        
                var jsonData = {
                    "odata.type":"ODataDemo.Category",
                    "ID": ID,
                    "Name": sName
                };
        
                oModel.oHeaders.DataServiceVersion = '3.0';
                oModel.oHeaders.MaxDataServiceVersion = '3.0';

                oModel.bUseBatch = false;
                oModel.create("/Categories", jsonData, {
                    success: function (oData) {
                        console.log(oData);
                        this.generatecategory();
                        sap.m.MessageBox.success(text1);
                    }.bind(this),
                    error: function (oError) {
                        console.error(oError);
                        sap.m.MessageBox.error(text2);
                    }.bind(this)
                });
                this.oDia.close();
            }
        },
        
        onPressClose: function () {
            this.oDia.close();
        },
        onPressLogOut:function(){
            var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("RouteView1");
        },
        onClickOk5: function (oEvent) {
            this.sPath = oEvent.getSource().getBindingContext("jsondata1").getObject().ID;
            var name = oEvent.getSource().getBindingContext("jsondata1").getObject().Name;
            var oView = this.getView();

            if (!this.oUpdate) {
                sap.ui.core.Fragment.load({
                    name: "com.sap.kt.sapproject.fragment.update",
                    controller: this
                }).then(function (oUpdate) {
                    this.oUpdate = oUpdate;
                    oView.addDependent(this.oUpdate);
                    sap.ui.getCore().byId("CA").setValue(name);
                    this.oUpdate.open();
                }.bind(this));
            } else {
                sap.ui.getCore().byId("CA").setValue(name);
                this.oUpdate.open();
            }
        },
        
        onPressSave2: function() {
            var text3 = this.getView().getModel("i18n").getResourceBundle().getText("title3")
            var text4 = this.getView().getModel("i18n").getResourceBundle().getText("title4")
            var sPath = "/" + "Categories(" + this.sPath + ")"
            console.log(sPath);
        
            var oModel = this.getOwnerComponent().getModel();
            var name = sap.ui.getCore().byId("CA").getValue();
            var payload = {
                "odata.type":"ODataDemo.Category",
                "Name": name
            };
        
            oModel.setUseBatch(false);
            
            oModel.oHeaders.DataServiceVersion = '3.0';
            oModel.oHeaders.MaxDataServiceVersion = '3.0';

            oModel.update(sPath, payload, {
                success: function(oData) {
                    console.log(oData);
                    sap.m.MessageBox.success(text3);
                    this.generatecategory();
                    this.oUpdate.close();
                }.bind(this),
                error: function(oError) {
                    sap.m.MessageBox.error(text4);
                }
            });
        },
        
        onPressClose2: function () {
            this.oUpdate.close();
        },
          onPressdelete: function (oEvent) {
            var text5 = this.getView().getModel("i18n").getResourceBundle().getText("title5")
            var text6 = this.getView().getModel("i18n").getResourceBundle().getText("title6")
            this.sPath = oEvent.getParameter("listItem").getBindingContext("jsondata1").getObject().ID;
            var sPath = "/" + "Categories(" + this.sPath + ")"
                console.log(sPath)
                var oModel = this.getOwnerComponent().getModel();
                oModel.bUseBatch = false;
                
                oModel.oHeaders.DataServiceVersion = '3.0';
                oModel.oHeaders.MaxDataServiceVersion = '3.0';

                oModel.remove(sPath, {
                    success: (oData) => {
                        console.log(oData);
                        sap.m.MessageBox.success(text5);
                        this.generatecategory();
                    },
                    error: (error) => {
                        sap.m.MessageBox.error(text6);
                        console.log(error);
                    }
                });

            },
    });
});
