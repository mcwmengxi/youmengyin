## Charles安装

### 1 激活
计算Charles激活码 https://www.zzzmode.com/mytools/charles/
打开Charles ==> Help ==> Register Charles => 输入激活码

### 2. 代理配置

2.1、代理设置
Proxy ==> Proxy Settings
1.勾选 Enable tranaparent HTTP proxying
2.勾选 Enable SOCKS proxy

2.2、抓取端口设置
Proxy --> SSL Proxy Settings
1.勾选Enable SSL Proxying
2.点击Add，添加抓取端口 * : *

### 3.证书认证

3.1 电脑认证

Help ==> SSL Proxying ==> Install Charles Root Certificate ==> 安装证书 ==> 本地计算机 ==> 将所有的证书都放入下列存储 ==> 点击浏览,选择”受信任的根证书颁发机构” ==> 完成

验证:
Help ==> SSL Proxying ==> Install Charles Root Certificate ==> 证书路径 ==> 证书状态显示”该证书没有问题”即可

3.2、手机证书信任
1、Help ==> SSL Proxying ==> Install Charles Root Certificate on a Mobile Device or Remote Browser