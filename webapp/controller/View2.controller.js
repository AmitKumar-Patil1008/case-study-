sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	function (Controller) {
		"use strict";

		return Controller.extend("com.sap.kt.sapproject.controller.View2", {
			onInit: function () {
				var oView = this.getView();
				this.localModel = new sap.ui.model.json.JSONModel();
				this.getOwnerComponent().setModel(this.localModel, "modeldata2");

				var oModel = this.getOwnerComponent().getModel();

				oModel.oHeaders.DataServiceVersion = '3.0';
				oModel.oHeaders.MaxDataServiceVersion = '3.0';

				// Read Categories data
				oModel.read("/Categories", {
					success: function (odata) {
						var jsondata = new sap.ui.model.json.JSONModel(odata.results);
						oView.setModel(jsondata, "Categories");
					}.bind(this),
					error: function (error) {
						console.error("Error reading Categories: " + error);
					}
				});

				// Read Products data
				oModel.read("/Products", {
					success: function (odata) {
						var jsonData1 = new sap.ui.model.json.JSONModel(odata.results);
						oView.setModel(jsonData1, "Products");
					}.bind(this),
					error: function (error) {
						console.error("Error reading Products: " + error);
					}
				});

				// Read data for table
				oModel.read("/Products", {
					urlParameters: {
						"$expand": "Categories"
					},
					success: function (oData) {
						for (var i = 0; i < oData.results.length; i++) {
							oData.results[i].CatName = oData.results[i].Categories.results[0].Name;
						}
						console.log(oData);
						var oModel = new sap.ui.model.json.JSONModel(oData.results);
						this.getView().setModel(oModel, "modeldata");
					}.bind(this),
					error: function (oError) {
						sap.m.MessageToast.show("Error reading table data: " + oError.message);
					}
				});

			},
			
			onSelectionChange: function () {
				var oCategoriesMultiComboBox = this.byId("CategoriesMultiComboBox");
				var oProductsMultiComboBox = this.byId("ProductsMultiComboBox");
				var oRatingComboBox = this.byId("RatingComboBox");
			
				var aSelectedCategoryItems = oCategoriesMultiComboBox.getSelectedItems();
				var aSelectedProductItems = oProductsMultiComboBox.getSelectedItems();
				var aSelectedRatingItems = oRatingComboBox.getSelectedItems();
			
				var aSelectedCategoryIDs = aSelectedCategoryItems.map(function (oItem) {
					return oItem.getText();
				});
				var aSelectedProductIDs = aSelectedProductItems.map(function (oItem) {
					return oItem.getText();
				});
				var aSelectedRatingIDs = aSelectedRatingItems.map(function (oItem) {
					return oItem.getText();
				});
			
				var filters = [];
				
				if (aSelectedCategoryIDs.length > 0) {
					var categoryFilters = aSelectedCategoryIDs.map(function(categoryID) {
						return new sap.ui.model.Filter("CatName", sap.ui.model.FilterOperator.EQ, categoryID);
					});
					filters.push(new sap.ui.model.Filter({ filters: categoryFilters, and: false }));
				}
				
				if (aSelectedProductIDs.length > 0) {
					var productFilters = aSelectedProductIDs.map(function(productID) {
						return new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.EQ, productID);
					});
					filters.push(new sap.ui.model.Filter({ filters: productFilters, and: false }));
				}
				
				if (aSelectedRatingIDs.length > 0) {
					var ratingFilters = aSelectedRatingIDs.map(function(ratingID) {
						return new sap.ui.model.Filter("Rating", sap.ui.model.FilterOperator.EQ, ratingID);
					});
					filters.push(new sap.ui.model.Filter({ filters: ratingFilters, and: false }));
				}
			
				this.byId("table").getBinding("items").filter(filters);
			},
			
			onPress: function () {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("RouteView3");

			},

			addToCart: function (oEvent) {
				var oProduct = oEvent.getSource().getBindingContext("modeldata").getObject();
				sap.m.MessageToast.show("Product " + oProduct.Name + " added to your shopping cart");

				var localModel = this.getOwnerComponent().getModel("modeldata2");
				var data = localModel.getData();

				if (!Array.isArray(data)) {
					data = [];
				}

				data.push({
					"ID": oProduct.ID,
					"Name": oProduct.Name,
					"Price": oProduct.Price,
					"Rating": oProduct.Rating
				});

				localModel.setData(data);
				localModel.refresh();
			},
			onPressLog: function () {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("RouteView1");
			},



		});
	});
