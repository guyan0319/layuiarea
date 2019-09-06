<?php
$id = $_GET['id'] ?? 0;
$type = $_GET['type'] ?? 0;//
if(!$type && !$id ){
    $data = [0 => [['code' => 110000, 'name' => '北京'],
        //其他省...
        ['code' => 130000, 'name' => "河北"],],
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

