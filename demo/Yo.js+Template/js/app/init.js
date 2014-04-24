/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, yo, App, define, brackets: true, $, jQuery, window, document, navigator*/

/*****
 * @desc : Initialize the application
 * @param :
 *****/

App.init = function () {
    "use strict";
    
	var test1 = yo.utils.template.add({
		ele : ".test",
		root : ".hero",
		template : "test.html"
	}, function () {
		console.log("callback executed");
	});
    
    console.log(test1);
	
	
	var test2 = yo.utils.template.add({
		ele: ".test",
		root: ".hero",
		template: "test.html"
	}, function () {
		console.log("child added");
	});
	
	var jsonData = {
		name : "Avinash",
		company: "SocioMobilePlus",
		years: 1
	};
	
	var test3 = yo.utils.template.add({
		ele: "#test3",
		root: ".hero",
		template: "test.html",
		data: {
			name: jsonData.name,
			company: jsonData.company,
			years: jsonData.years
		}
	}, function () {
		
	});
    
    console.log(test3);
	
   
	var test4 = yo.utils.template.add({
		ele: "#test3",
		template: "test.html",
		data: {
			name: jsonData.name,
			company: jsonData.company,
			years: jsonData.years
		}
	}, function () {
		
	});
	console.log(test4);
    
    yo.utils.template.destroy({
        uid: test4.uid
    }, function () {
    });
    
    console.log(yo.utils.template.cache());
	
	var namesArray = [{slno: 1, name: "Ajain"}, {slno: 2, name: "Vivek"}];
	
	var test5 = yo.utils.template.add({
		ele : ".test4",
		root : ".hero",
		template: "test.html",
		data: namesArray
	}, function () {
		alert("test");
	});
	
  
/*	var i;
	var test5;
	var namesArray = ["Ajain", "Rahul", "Vivek", "GPS"];
	
	for (i = 1; i <= namesArray.length; i++) {
		test5 = yo.utils.template.add({
			ele : ".test4",
			root : ".hero",
			template: "test.html",
			data: {
				slno: i,
				name: namesArray[i - 1]
			}
		});
	}
	
	
    
    yo.utils.template.remove({
        uid: test5.uid
    }, function () {
    });*/
	
	
    
	/*
	var test5;
	for (i = 1; i <= namesArray.length; i++) {
		test5 = template.add({
			ele : ".test4",
			template: "test.html",
			data: {
				slno: i,
				name: namesArray[i - 1]
			}
		});
	}*/
	
	/*yo.utils.template.destroy({
		uid: test3.uid
	}, function () {
		console.log("removed");
	});
	console.log(yo.utils.template.cache());*/
};