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