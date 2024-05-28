sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.kt.sapproject.controller.View5", { 
            onInit: function() {
                var oModel = this.getOwnerComponent().getModel();
              
                oModel.oHeaders.DataServiceVersion = '3.0';
                oModel.oHeaders.MaxDataServiceVersion = '3.0';

                 // Read Products data
            oModel.read("/Products", {
                success: function(odata) {
                    var jsonData1 = new sap.ui.model.json.JSONModel(odata.results);
                    this.getView().setModel(jsonData1, "Products");
                }.bind(this),
                error: function(error) {
                    console.error("Error reading Products: " + error);
                }
            }); 
            },
            
            
            });
          });