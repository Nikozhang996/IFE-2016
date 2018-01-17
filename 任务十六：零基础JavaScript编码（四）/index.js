/*
 	参考以下示例代码，用户输入城市名称和空气质量指数后，点击“确认添加”按钮后，就会将用户的输入在进行验证后，添加到下面的表格中，新增一行进行显示
	用户输入的城市名必须为中英文字符，空气质量指数必须为整数
	用户输入的城市名字和空气质量指数需要进行前后去空格及空字符处理（trim）
	用户输入不合规格时，需要给出提示（允许用alert，也可以自行定义提示方式）
	用户可以点击表格列中的“删除”按钮，删掉那一行的数据
 */

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */

//获取城市名，质量指数，与添加按钮
	var aqi_city_input = document.getElementById("aqi-city-input"),
		aqi_value_input = document.getElementById("aqi-value-input"),
		add_btn = document.getElementById("add-btn");
		
//定义一些正则表达式
	var regCity = /^[\u4e00-\u9fa5a-zA-Z\/\(\)]+$/;
	var regData = /[0-9]/;
//去除两边空格
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

	var aqiData = {};
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var	cityValue = aqi_city_input.value,
		numValue = aqi_value_input.value;
	//判断是否符合条件
	if (!regCity.test(trim(cityValue))) {
		alert('请输入中英文字符！');
	} else if(!regData.test(trim(numValue))){
		alert('空气质量指数必须为整数！');
	} else{
		aqiData[cityValue] = numValue;
	}
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	//获取当前表格
	var aqi_table = document.getElementById("aqi-table").tBodies[0];
	var tbodyHTML = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
	var textContent = "";
	//使用for……in……语句
	for (var item in aqiData) {	
		textContent += 
		'<tr><td>'+item+'</td><td>'+aqiData[item]+'</td><td><button>删除</button></td></tr>'
	}
	
	//一次性写入所有HTML内容，减少DOM操作提高性能
	aqi_table.innerHTML = (tbodyHTML += textContent);
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
  // do sth.
  console.log(e.target.tagName)
  
  
  
  //按钮的父，父节点为tr，然后tr的第一个子节点为城市代表的节点，即取得要删除的城市名称
  var city = e.target.parentNode.parentNode.firstChild.innerHTML;
  //删除
  delete aqiData[city];
  //删除后再次执行renderAqiList方法，刷新界面
  renderAqiList();
}

function init() {
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	add_btn.addEventListener("click",function () {
		addBtnHandle()
	},false);
	
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  
  
 	var table = document.getElementById("aqi-table");
	table.addEventListener("click",delBtnHandle);



}

init();

/*
 * 时间：2017-9-25
 * 总结：
 * 对正则表达式还是很不熟悉；
 * 对象访问，若非字符串则需使用方括号 [] 访问和操作。
 * for in 操作 for each 操作
 * 编程思路最重要，不要试图单点线性操作，试图从大局出发
 * 对象事件代理，事件绑定，e.target，还需更多实践
 * 
 * */