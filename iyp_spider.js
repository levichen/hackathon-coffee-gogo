var curl	   	          = require('node-curl');
var htmlparser 	          = require('htmlparser2');
var MongoClient			  = require('mongodb').MongoClient;
var iypUrl	   	          = 'https://www.iyp.com.tw';
var db;

(function() {
	var url = '';
	MongoClient.connect(url, function(err, database) {
		db = database;
		console.log("Connected correctly to server");
		spiderData();
	});
})();

function spiderData() {	
	var url = iypUrl + '/food-catering/cuisine/';
	var handler = new htmlparser.DomHandler(function(err, dom) {
		searchDOM(dom, {
			'type': 'tag', 
			'name': 'ul',
			'attribs': {
				'class': 'sub clearfix'
			}
		}, function(dom) {
			getRestaurantCategory(dom);
		});
	});

	curl(url, function(err) {
		new htmlparser.Parser(handler).parseComplete(this.body);
	});
}

function getRestaurantCategory(restaurantCategoryDOM) {
	var restaurantCategory = [];
	var restaurantChineseCategory = [];

	for (var i = 0; i < restaurantCategoryDOM.children.length; i++) {
		var dom = restaurantCategoryDOM.children[i];

		if (dom.type == 'tag' && dom.name == 'li') {
			var url = dom.children[0].attribs.href;
			var categoryName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));

			restaurantChineseCategory.push(dom.children[0].children[0].data);
			restaurantCategory.push(categoryName);
		}
	}

	// insertCategory(restaurantCategory);
	spiderRestaurantInfo(restaurantCategory, restaurantChineseCategory, 0, 0);
}

function spiderRestaurantInfo(restaurantCategory, restaurantChineseCategory, page, position) {
	var handler = new htmlparser.DomHandler(function(err, dom) {
		searchDOM(dom, {
			'type': 'tag', 
			'name': 'div',
			'attribs': {
				'id': 'content',
				'class': 'content'
			}
		}, function(dom) {
			if (!dom || !dom.hasOwnProperty('children')) {
				return;
			}


			var hasNext = hasNextPage(dom.children);
			var listDom = getStoreListDOM(dom.children);

			if (listDom && listDom.hasOwnProperty('children')) {
				for (var i = 0; i < listDom.children.length; i++) {
					if (listDom.children[i].type == 'tag' && listDom.children[i].name == 'li') {
						getStoreInfo(listDom.children[i].children, restaurantChineseCategory[position]);
					}
				}			
			}

			if (hasNext) {
				console.log('page:' + page);
				spiderRestaurantInfo(restaurantCategory, restaurantChineseCategory, ++page, position);
			}
			else if (!hasNext && position < restaurantCategory.length) {
				console.log('change category:' + position);
				spiderRestaurantInfo(restaurantCategory, restaurantChineseCategory, 0, ++position);
			}
		});
	});

	var url = iypUrl + '/showroom.php?cate_name_eng_lv1=food-catering&cate_name_eng_lv3=' + restaurantCategory[position] + '&a_id=6&p=' + page;
	curl(url, function(err) {
		new htmlparser.Parser(handler).parseComplete(this.body);
	});
}

function hasNextPage(dom) {
	for (var i = 0; i < dom.length; i++) {
		if (dom[i].type == 'tag' && dom[i].name == 'div' && dom[i].attribs.class == 'paginator clearfix') {
			for (var j = 0; j < dom[i].children.length; j++) {
				if (dom[i].children[j].type == 'tag' && dom[i].children[j].name == 'a' && dom[i].children[j].attribs.class == 'next') {
					return true;
				}
			}
			return false;
		}
	}
}

function getStoreListDOM(dom) {
	for (var i = 0; i < dom.length; i++) {
		if (dom[i].type == 'tag' && dom[i].attribs.hasOwnProperty('id') && dom[i].attribs.id == 'search-res') {
			for (var j = 0; j < dom[i].children.length; j++) {
				var storeListDOM = dom[i].children[j];

				if (storeListDOM.type == 'tag' && storeListDOM.name == 'ol') {
					if (storeListDOM.attribs.hasOwnProperty('class') && storeListDOM.attribs.class == 'general') {
						return storeListDOM;
					}
				}
			}		
		}
	}
}

function getStoreInfo(dom, category) {
	var title, tel, address, href;

	for (var i = 0; i < dom.length; i++) {		
		if (dom[i].type == 'tag' && dom[i].name == 'h3') {
			if (dom[i].children.length < 0) {
				continue;
			}

			if (dom[i].children[0].type == 'tag' && dom[i].children[0].name == 'a') {
				href = dom[i].children[0].attribs.href;
				title = dom[i].children[0].attribs.title.trim();
				tel = href.substring(href.indexOf('/', 2) + 1, href.lastIndexOf('/'));
			}
		}


		if (dom[i].type == 'tag' && dom[i].name == 'ul') {
			if (dom[i].children.length < 0) {
				return;
			}

			for (var j = 0; j < dom[i].children.length; j++) {
				if (dom[i].children[j].type == 'tag' && dom[i].children[j].name == 'li' && dom[i].children[j].attribs.class == 'address') {
					address = getAddress(dom[i].children[j].children);
				}
			}
		}
	}

	// console.log(title + ',' + tel + ',' + address);
	if (title != '' && address != '') {
		insertStoreInfo({
			'href': 'http:' + href,
			'title': title,
			'tel': tel,
			'address': address,
			'category': category
		});
	}
}

function getAddress(dom) {
	for (var i = 0; i < dom.length++; i++) {
		if (dom[i].type == 'tag' && dom[i].name == 'span' && dom[i].attribs.class == 'view-map ico altfn') {
			var goMapUrl = dom[i].attribs['go-map'];
			return goMapUrl.substring(goMapUrl.lastIndexOf('=') + 1, goMapUrl.length);
		}
	}
}

function searchDOM(dom, ckPtrs, callback) {
	for (var i = 0; i < dom.length; i++) {
		var keys = Object.keys(ckPtrs);
		var failedFlag = false;

		for (var j = 0; j < keys.length; j++) {
			var key = keys[j];

			if (dom[i] && !dom[i].hasOwnProperty(key)) {
				break;
			}
			
			if (typeof ckPtrs[key] === 'string') {
				if (dom[i] && dom[i][key] != ckPtrs[key]) {
					failedFlag = true;
					break;
				}
			}
			else if (typeof ckPtrs[key] == 'object') {
				var otherKeys = Object.keys(ckPtrs[key]);

				for (var k = 0; k < otherKeys.length; k++) {
					var otherKey = otherKeys[k];

					if (dom[i] && dom[i][key][otherKey] != ckPtrs[key][otherKey]) {
						failedFlag = true;
						break;
					}
				}
			}
		}

		if (!failedFlag) {
			callback(dom[i]);
		}

		if (dom[i] && typeof dom[i].children != 'undefined') {
			searchDOM(dom[i].children, ckPtrs, callback);
		}
	}
}

function insertCategory(restaurantCategory, position) {
	var collection = db.collection('iyp');

	collection.insert({
			'name': restaurantCategory[position]
		}, 
		function(err, result) {
			if (err) {
				console.log(err);
			}

			if (position < restaurantCategory.length) {
				insertCategory(restaurantCategory, ++position);
			}
		}
	);
}

function insertStoreInfo(storeInfo) {
	var collection = db.collection('iyp');

	collection.insert(storeInfo, 
		function(err, result) {
			if (err) {
				console.log(err);
			}
		}
	);
}
