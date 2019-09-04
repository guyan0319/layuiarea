# layuiarea
这个是一个layui省市区三级联动插件，近来使用layui后台模板框架开发后台系统，要用到省市县/区三级联动，本想从网上找个现成的轮子，然没有自己想要的需求，就自己造了个。

本插件实现省市区相应数据通过ajax动态从服务端加载数据，省市区数据结构key-value形式。

### html示例：

```
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="renderer" content="webkit">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="format-detection" content="telephone=no">
		<link rel="stylesheet" href="./layui/css/layui.css" />
	</head>
	<body>
		<div class="layui-form">
			<div class="layui-input-inline">
				<select name="province" lay-filter="province" class="province" province_default="110000">
					<option value="">请选择省</option>
				</select>
			</div>
			<div class="layui-input-inline">
				<select name="city" lay-filter="city" city_default="110000" disabled>
					<option value="">请选择市</option>
				</select>
			</div>
			<div class="layui-input-inline">
				<select name="area" lay-filter="area" area_default="" disabled>
					<option value="">请选择县/区</option>
				</select>
			</div>
		</div>
	</body>
	<script type="text/javascript" src="./layui/layui.js"></script>
	<script type="text/javascript">
		layui.config({
			base : "./layuiarea/" //layuiarea.js的路径
		}).use([ 'layer', 'jquery', "layuiarea" ], function() {
			var layer = layui.layer, $ = layui.jquery, layuiarea = layui.layuiarea(); 
		});
	</script>
<html>
```

### 说明：

这里我们可以通过给province_default、city_default、area_default设值，来实现省市区默认选中项。

 如只想显示二级联动，可将以下代码注释.

```
			<div class="layui-input-inline">
				<select name="area" lay-filter="area" area_default=""  disabled>
					<option value="">请选择县/区</option>
				</select>
			</div>
```

### js示例

```
layui.define(["form","jquery"],function(exports){
    var form = layui.form,
        $ = layui.jquery,
        Layuiarea = function(){};

    Layuiarea.prototype.provinces = function() {
        //加载省数据
        var proHtml = '',that = this,url="https://demo.duiniya.com/test2/area.php";
        $.get(url+"?type=0&id=0", function (data) {
			
            var dataObj = eval(data);
			var province_default = $("select[name=province]").attr("province_default");
			var city_default = $("select[name=city]").attr("city_default");
			var area_default = $("select[name=area]").attr("area_default");
            $.each(dataObj,function(idx,item){
				if(province_default ==item.code){					
                     proHtml += '<option value="' + item.code + '" selected="">' + item.name + '</option>';
				}else{
					 proHtml += '<option value="' + item.code + '">' + item.name + '</option>';
				}
            });

            //初始化省数据
            $("select[name=province]").append(proHtml);
			form.render();//更新  所在容器内的全部表单状态
			//处理市默认值
			if(province_default!="" && city_default!="" ){
				$.get(url+"?type=1&id="+province_default, function (data) {
                        var ciHtml='';
                        var dataObj = eval(data);
                        $.each(dataObj,function(idx,item){
							if(city_default ==item.code){					
								 ciHtml += '<option value="' + item.code + '" selected="">' + item.name + '</option>';
							}else{
								 ciHtml += '<option value="' + item.code + '">' + item.name + '</option>';
							}                         
                        });
                        //加载市
                        $("select[name=city]").append(ciHtml).removeAttr("disabled");
                        form.render();
                });
				if(area_default!=""){
					//默认县/区
					    $.get(url+"?type=2&id="+city_default, function (data) {
                        var areaHtml='';
                        var dataObj = eval(data);
                        $.each(dataObj,function(idx,item){
							if(area_default ==item.code){					
								 areaHtml += '<option value="' + item.code + '" selected="">' + item.name + '</option>';
							}else{
								 areaHtml += '<option value="' + item.code + '">' + item.name + '</option>';
							}    
                        });
                        //加载县区
                        $("select[name=area]").append(areaHtml).removeAttr("disabled");
                        form.render();
                    });					
				}
			}
            form.on('select(province)', function (proData) {
                $("select[name=city]").html('<option value="">请选择市</option>');
                var value = proData.value;
                if (value > 0) {
                    $.get(url+"?type=1&id="+value, function (data) {
                        var ciHtml='';
                        var dataObj = eval(data);
                        $.each(dataObj,function(idx,item){
                            ciHtml += '<option value="' + item.code + '">' + item.name + '</option>';
                        });
                        //加载市
                        $("select[name=city]").append(ciHtml).removeAttr("disabled");
                        form.render();
                    });
                } else {
                    $("select[name=city]").attr("disabled", "disabled");
                }
            });

            form.on('select(city)', function (cityData) {
                $("select[name=area]").html('<option value="">请选择县/区</option>');
                var value = cityData.value;
                if (value > 0) {
                    $.get(url+"?type=2&id="+value, function (data) {
                        var areaHtml='';
                        var dataObj = eval(data);
                        $.each(dataObj,function(idx,item){
                            areaHtml += '<option value="' + item.code + '">' + item.name + '</option>';
                        });
                        //加载县区
                        $("select[name=area]").append(areaHtml).removeAttr("disabled");
                        form.render();
                    });
                } else {
                    $("select[name=area]").attr("disabled", "disabled");
                }
            });
        })
    }

    var layuiarea = new Layuiarea();
    exports("layuiarea",function(){
        layuiarea.provinces();
    });
})
```

### php示例

```
<?php
$id = $_GET['id'] ?? 0;
$type = $_GET['type'] ?? 0;//
if(!$type){
    $data = [0 => [['code' => 110000, 'name' => '北京'],
        //其他省...
        ['code' => 130000, 'name' => "河北"],],
        130100=>[['code' => 130102, 'name' => '长安区'],],
        110000=>[['code' => 110101, 'name' => '东城区'],],
        130400=>[['code' => 130402, 'name' => '邯山区'],],
    ];
}elseif($type==1){
    //市
    $data = [ 110000 => [['code' => 110000, 'name' => "北京"]],
        130000 => [['code' => 130100, 'name' => '石家庄'], ['code' => 130400, 'name' => "邯郸"]],
        ];
}else{
    //区
    $data = [
        130100=>[['code' => 130102, 'name' => '长安区'],],
        110000=>[['code' => 110101, 'name' => '东城区'],],
        130400=>[['code' => 130402, 'name' => '邯山区'],],
    ];
}
echo json_encode($data[$id], JSON_UNESCAPED_UNICODE);
```



预览地址：https://demo.duiniya.com/test2/demo.html

项目地址：https://github.com/guyan0319/layuiarea

如有任何问题或建议，欢迎批评指正！