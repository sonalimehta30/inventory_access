var app = angular.module('myInventory',[
	'ngAnimate', 
	'ngSanitize', 
	'ui.bootstrap'	
])

app.controller("inventoryCtrl",function($scope,$http) {
	$scope.limitPerPage = 5
	$scope.begin = 0
	$scope.page_nums = []
	$scope.currentPage = 1;
	$scope.confirmAction = 0;

	// loader = 1 , loading animation shown with table placeholder in background
	// loader = 0 , real data to be shown while keeping loader hidden
	$scope.loader = 0; 
	$scope.action = 'add';
	newItemObject = {
      "name": "",
      "description": "",
      "ean": "",
      "upc": "",
      "image": "Data Not Available",
      "images": [
        {
          "title": "Data Not Available",
          "description": "Data Not Available",
          "url": "Data Not Available"
        },
      ],
      "net_price": 0,
      "taxes": 0,
      "price": "",
      "categories": [],
      "tags": []
    }

	if (1) { // **** change this value to zero in order to use mock data ***
	// Network call to backend API for fetching Inventory data
		$http.get(
			"https://fakerapi.it/api/v1/products?_quantity=50&_categories_type=string&_price_max=2000&locale=en_EN"
		).then(function reqSuccess(resp){
			console.log(resp)
			$scope.loader = 0;
			if (resp.data !== undefined) {
				if (resp.data.data) {
					$scope.inventory_Data = resp.data.data
					$scope.totalItems = $scope.inventory_Data.length;
				}
			}
		}, function catchErr(err){
			console.log(err)
		})
	}else{
		$scope.inventory_Data = main_json.data
		$scope.totalItems = $scope.inventory_Data.length;

	}

	$scope.openModalForm = function(action,index){
		if(action == 'add'){
			$scope.action = 'add'
			$scope.modalHeading = "Add Item to Inventory"
			$scope.itemDetails = newItemObject
		}else {
			$scope.action = 'edit'
			$scope.modalHeading = "Edit Invetory Item"
		    $scope.curr_index = index + ( ($scope.currentPage-1) * $scope.limitPerPage)
			$scope.itemDetails = angular.copy($scope.inventory_Data[$scope.curr_index])
		}
		$('#myModalForm').modal('show');
	}

	$scope.submitModalData = function(){
		// form data checks 
			if ($scope.itemDetails.name.trim() == '') {
				swal("Please enter the name of item")
				return
			}
			if ($scope.itemDetails.description.trim() == '') {
				swal("Please enter the description of item")
				return
			}
			if ($scope.itemDetails.net_price <=0 ) {
				swal("Please ensure the Net price of item is greater than zero")
				return
			}
			if ($scope.itemDetails.ean.trim() == '') {
				swal("Please enter the EAN code of item")
				return
			}
			if ($scope.itemDetails.upc.trim() == '') {
				swal("Please enter the UPC code of item")
				return
			}
			if ($scope.itemDetails.categories.length==0) {
				swal("Please add atleast one category for item")
				return
			}
			if ($scope.itemDetails.tags.length==0) {
				swal("Please add atleast one tag for item")
				return
			}

		// form data checks end
		$scope.itemDetails.price = parseInt($scope.itemDetails.net_price*0.01*$scope.itemDetails.taxes) + parseInt($scope.itemDetails.net_price)

		if($scope.action == 'add'){
			$scope.inventory_Data.splice(0,1,$scope.itemDetails)
			swal("Done!", "Item added to inventory successfully", "success")
			$('#myModalForm').modal('hide')
			// network call here to add new item to inventory
		}else {
			$('#confirmationModal').modal('show')
		}
	}

	$scope.editBoxCat = function(action,index){
		$scope.cat_index = index;

		if (action=='edit') {
			$scope.editCat = 1;

		}else if (action=='add'){
			if ($scope.newCat == '') {
				$('#newCat_input').focus()
				return;
			}else{
				$scope.itemDetails.categories.push($scope.newCat)
				$scope.newCat = ''
			}
		}else{
			$scope.itemDetails.categories.splice(index,1)
			$scope.editCat = 0;
		}

	}

	$scope.editBoxTag = function(action,index){
		$scope.tag_index = index;
		if (action=='edit') {
			$scope.editTag = 1;
		}else if (action=='add'){
			if ($scope.newTag == '') {
				$('#newTag_input').focus()
				return;
			}else{
				$scope.itemDetails.tags.push($scope.newTag)
				$scope.newTag = ''
			}
		}else{
			$scope.itemDetails.tags.splice(index,1)
			$scope.editTag = 0;
		}
	}

	$scope.deleteItem = function (uniqueId,index){
		$scope.action = 'delete'
		$scope.curr_index = index + ( ($scope.currentPage-1) * $scope.limitPerPage)
		$('#confirmationModal').modal('show')
	}

	$scope.performConfirmed = function (index){
		if($scope.action == 'edit'){
			$('#myModalForm').modal('hide')
	    	$scope.inventory_Data[$scope.curr_index] = angular.copy($scope.itemDetails)
		}else{
			$scope.inventory_Data.splice($scope.curr_index,1)
		}
		// Network call here to EDIT or DELETE item from inventory

		$scope.totalItems = $scope.inventory_Data.length;
		$('#confirmationModal').modal('hide')
	}


})