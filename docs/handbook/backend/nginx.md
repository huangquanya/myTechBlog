---
title: Nginx学习

author: 好运来

date: '2022-1-1'
---

# Nginx学习

# 1. 简介

## 1.1 特点

1. 高性能Web服务器和反向代理服务器
2. 内存占用少，并发能力强，高性能、低系统资源
3. 免费开源
4. C语言开发

### 1.2 正向代理和反向代理

#### 1.2.1 反向代理

​	以代理服务器来接受Internet上的连接请求，然后将请求转发给内部网络上的服务器，并将服务器上得到的结果返回给Internet上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器

<img src="\nginx知识.assets\image-20211224165129560.png" alt="image-20211224165129560" style="zoom: 80%;" />

#### 1.2.2 正向代理

正向代理类似一个跳板机，代理访问外部资源

# 2 nginx环境搭建



## 2.1 下载

1. 下载地址 http://nginx.org/en/download.html
2. 服务器下载命令 wget http://nginx.org/download/nginx-1.21.4.tar.gz
3. 放到/home/soft/ 目录下

## 2.2 安装

linux命令: 

1. 查看当前路径：pwd
2. 查看当前文件下全部文件：ll

### 2.2.1 安装前的准备

​	nginx 的安装需要确定Linux安装预置库，否则配置和编译会出问题

1. gcc编译器是否安装

   检查是否安装：yum list installed | grep gcc

   安装：yum install gcc -y

2. openssl库是否安装

   检查是否安装：yum list installed | grep openssl

   安装：yum install openssl openssl-devel -y

3. pcre库是否安装

   检查是否安装：yum list installed | grep pcre

   安装：yum install pcre pcre-devel -y

4. zlib库是否安装

   检查是否安装：yum list installed | grep zlib

   安装：yum install zlib zlib-devel -y

5. 一键安装

   yum install gcc openssl openssl-devel pcre pcre-devel zlib z-lib-devel -y

### 2.2.2 正式安装

1. 解压下载下来的nginx文件，执行：

   tar -zxvf nginx.tar.gz

2. 切换至解压后的nginx主目录，执行命令：

   cd nginx

3. 在nginx主目录nginx下执行命令：(--prfix是指定nginx安装路径)

   ./config --prifix=/usr/local/nginx

4. 执行命令进行编译：

   make

5. 执行安装

   make install

6. 安装完成后，进到/usr/local/nginx目录下，查看内容

   ll

## 2.3 启动

### 2.3.1 普通启动

 切换到nginx安装目录的sbin目录下，执行：./nginx

### 2.3.2 配置文件启动

​	-c 是指定配置文件，且配置文件路径必须指定绝对路径

1. 方式1：

   ./nginx -c /usr/local/nginx/conf/nginx.conf

2. 方式2：

   /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf

### 2.3.3 检查是否启动

1. 通过查看进程：

   ps -ef | grep nginx

2. nginx体系结构

   nginx体系结构由master进程和worker进程组成

   - master进程读取配置文件，并维护worker进程，
   - worker进程对请求进行时机处理

   nignx启动后，安装目录下会出现_temp结尾的文件，这些是临时文件

## 2.4 关闭

### 2.4.1 优雅关闭nginx

方法1：

1. 找出nginx的进程号：

   ps -ef | grep nginx

2. 执行命令：

   kill -QUIT 主pid

方法二：

1. ​	./nginx -s quit

**注意**：

- 其中pid是主进程的pid(master process),其他为子进程pid（worker process）
- 这种关闭方式会处理完请求后再关闭，时间长



### 2.4.2 快速关闭nginx

方法1：

1. 找出nginx的进程号：

   ps -ef | grep nginx

2. kill -TERM 主pid

   **注意**：

   - 其中pid是主进程的pid(master process),其他为子进程pid（worker process）
   - 这种关闭方式不管请求是否处理完成，直接关闭，比较暴力，快速的关闭

方法2：

1. ​	nginx -s stop

### 2.4.3 重启nginx

nginx -s reload

### 2.4.4 其他命令

1. 测试配置文件是否存在问题(检查语法问题)

   /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf -t

   或

   nginx -t

2. Linux上查看nginx版本：

   /usr/local/nginx/sbin/nginx -V

   nginx -v

   -v （小写）显示nginx的版本

   -V	(大写)	显示nginx的版本、编译器版本和配置参数

3. 查看帮助

   nginx -？

   nginx -h

4. 设置nginx使用的配置文件

   nginx -c /usr/local/nginx/conf/nginx.conf

# 3 nginx配置文件说明及nginx主要应用

![image-20211228113501348](\nginx知识.assets\image-20211228113501348.png)

## 3.1 nginx的核心配置文件

nginx/conf目录下，名为nginx.conf

```nginx
# 配置worker进程运行用户root则拥有root权限
# user nobody；
# 配置工作进程数，根据硬件调整，通常等于cpu数量或2倍于CPU数量
worker_processes 2;

# 配置全局错误日志及类型，[debug | info | notice | warn | error | crit],默认是error
error_log logs/error.log;
#error_log logs/error.log notice;
#error_log logs/error.log info;

pid	logs/nginx.pid; #配置进程pid文件


###====================================================================

#配置工作模式和连接数
events {
    #use epoll;#默认就是使用epoll
    worker_connections 1024; #配置每个worker进程连接数上限(最大值65535=2^16-1)，nginx支持的总连接数就等于worker_connections*worker_processes
}

###====================================================================

#配置http服务器，利用它的反向代理功能提供负载均衡支持
http {
    #配置nginx支持哪些多媒体类型，可以在conf/mime.types查看支持哪些多媒体类型
    include mime.types;
    #默认文件类型 流类型，可以理解为支持任意类型
    default_type application/octet-stream;
    #配置日志格式
    #log_format main '$remote_addr - $remote_user [$time] "$request"'
    #				 '$status $body_bytes_sent "$http_referer" '
    #				 '"$http_user_agent" "$http_x_forwarded_for"';
    
    #配置access.log日志及存放路径，并使用上面定义的main日志格式
    #access_log logs/access.log main;
    
    sendfile on; #开启高效文件传输模式
    #tcp_nopush on; #防止网络堵塞,需先开启sendfile
    
    #keepalive_timeout 0;
    keepalive_timeout 65; #长连接超时时间，单位秒
    
    #gzip on; #开启gzip压缩输出
    
    ###====================================================================
    
    
    #配置虚拟主机
    server {
        listen 80; #配置监听端口
        server_name localhost; #配置服务名
        #多个server 监听端口和服务名不能完全一致
        
        #charset koi8-r; #配置字符集 不配置默认为UTF-8
        #access_log logs/host.access.log main; #配置本虚拟主机的访问日志
        
        #默认的匹配斜杠/的请求，当访问路径中有斜杠/, 会被该location匹配到并进行处理
        location / {
            #root
            root html;
            #配置首页文件的名称
            index index.html index.htm;
        }
        
        #error_page 404 /404.html;	#配置404页面
        
        # redirect server error pages to the static page /50x.html;
        error_page	500 502 503 504	/50x.html; #配置50x错误页面
        
        #精确匹配
        location = /50x.html {
            root html;
        }
    }
    # 引入server配置文件
    include serverConfig.conf;
}


```

## 3.2 nginx 主要应用

- 静态网站部署
- 负载均衡
- 静态代理
- 动静分离
- 虚拟主机

# 4 静态网站部署

nginx是一个HTTP的web服务器，可以将服务器上的静态文件（如HTML、图片等）通过HTTP协议返回给浏览器客户端

## 4.1 例子

要访问目录下：/opt/static/ace/index.html

访问路径：ip+端口+/ace

```nginx
location /ace {
    root /opt/static/; #以分号结尾,root代表匹配的/的位置
}
```

## 4.2 匹配规则

**server中有多个location时，nginx的匹配规则**：

1. nginx服务器首先在server块中搜索是否有标准的uri和请求字符串匹配。如果有多个标准的uri可以匹配，就匹配其中匹配度最高的一个location。
2. nginx在使用location块中，正则uri和请求字符串，进行匹配。如果正则匹配成功，则结束匹配，并使用这个location处理请求；如果正则匹配失败，则使用标准的uri中，匹配度最高的location。

**备注**：

- 如果有精确匹配，会先进行精确匹配，匹配成功，立即返回结果。

- 普通匹配与顺序无关，因为按照匹配的长短来取匹配结果。

- 正则匹配与顺序有关，因为是从上往下匹配的。（首先匹配，就结束解析过程）

- 在location中，有一种统配的location， 所以的请求都可以匹配，如下：

  ```nginx
  location / {
      #因为所有地址都以/开头，所以这条规则将匹配到所有请求
      #但正则和最长字符串会优先匹配
  }
  ```

**结合标识符，匹配顺序如下**：

(location=) > (location完整路径) > (location ^~路径) > (location ~,~* 正则顺序) > (location部分起始路径) > (location /)

即

(精确匹配) > (最长字符串匹配，但完全匹配) > (非正则匹配) > (正则匹配) > (最长字符串匹配，不完全匹配) > (location通配)

# 5 负载均衡

## 5.1 负载均衡概述

​	负载均衡通常是指将请求“均衡”分摊到集群中多个服务器节点上执行，这里的均衡是指在一个比较大的统计范围内是基本均匀的，并不是完全均匀的。

## 5.2 负载均衡实现方式

### 5.2.1 硬件负载均衡

如：F5，深信服，Array等

**优点**：有厂商专业的技术服务团队提供支持，性能稳定

**缺点**：费用昂贵，对于规模较小的网络应用成本太高

### 5.2.2 软件负载均衡

如：nginx，LV5，HAProxy等

**优点**：免费开源，成本低廉

### 5.2.3 nginx负载均衡

1. 原理

   ![image-20211227162554022](\nginx知识.assets\image-20211227162554022.png)

2. 配置

   - 在http模块加上upstream配置(其中weight表示权重)，upstream是配置nginx与后端服务器负载均衡非常重要的一个模块，并且还能对后端服务器的健康情况进行检查，若后端服务器中的一台发生故障，则前端请求不会转发到该故障的机器
   - 在server模块里添加location，并配置proxy_pass,其中www.myweb.com字符串要和upstream后面的字符串相等

   ```nginx
    	upstream www.myweb.com {
    		server 192.168.115.128:8081;
       	server 192.168.115.128:8082;
    	}
    	
    	#配置虚拟主机
       server {
           listen 80;
           server_name localhost;
           
           #charset koi8-r;
           #access_log logs/host.access.log main;
           
           location / {
               #root
               root html;
               #配置首页文件的名称
               index index.html index.htm;
           }
           location /myweb {
   			proxy_pass http://www.myweb.com;
           }
   	}
   ```

## 5.3 nginx常用的负载均衡策略

#### 5.3.1 轮询（默认）

  **注意**：这里的轮询并不是每个请求轮流分配到不同的后端服务器，与ip hash类似，但，是按照访问url的hash结果来分配请求，使得每个url定向到同一个后端服务器，主要应用于后端服务器为缓存时的场景下。*如果后端服务器down掉，将自动剔除*。

### 5.3.2 权重

​	每个请求按照一定比例分发到不同的后端服务器，weight值越大，访问的比例越大，用于后端服务器性能不均的情况

```nginx
upstream backserver {
 	server 192.168.115.128:8081 weight=5;
    server 192.168.115.128:8082 weight=2;
 }
```



### 5.3.3 ip_hash

ip_hash也叫IP绑定，每个请求按访问ip的hash值分配，这样每个访问客户端会固定访问一个后端服务器，可以解决会话Session丢失的问题

```nginx
#算法：hash("124.207.55.82")%2    0, 1
upstream backserver {
    ip_hash;
 	server 192.168.115.128:8081;
    server 192.168.115.128:8082;
 }
```

### 5.3.4 最少连接

web请求会被转发到连接数最少的服务器上

```nginx
upstream backserver {
    least_conn; 
 	server 192.168.115.128:8081;
    server 192.168.115.128:8082;
 }
```

### 5.4 负载均衡其他几个配置

1. 配置

   ```nginx
   upstream backserver {
    	server 192.168.115.128:8081;
       #其它所有的非backup机器down的时候，才请求backup机器
       server 192.168.115.128:8082 backup;
    }
   ```

   ​		一般在项目上线的时候，可以分配部署不同的服务器上，然后对nginx重新reload。

   ​		reload不会影响用户的访问，或者可以给一个提示页面，系统正在升级

2. 配置

   ```nginx
   upstream backserver {
    	server 192.168.115.128:8081;
       #down表示当前的server是down状态，不参与负载均衡
       server 192.168.115.128:8082 down;
    }
   ```

# 6 静态代理

所有静态资源的访问改为访问nginx，而不是tomcat，这种方式叫静态代理，因为nginx更擅长静态资源的处理，性能好，效率高，在实际应用中，将静态资源如图片、css、html、js等交给nginx处理，而不是后台

## 6.1 nginx静态代理实现方式

### 6.1.1 方式一 在nginx.conf 的location中配置静态资源的后缀

例如：当访问静态资源，则从linux服务器/opt/static 目录下获取

```nginx
location ~.*\.(js|css|html|gif|jpg|png|jpeg|png|bmp|swf|loc|rar|zip|txt|flv|mid|doc|ppt|pdf|xls|mp3|wma)$ {
	root /opt/static;
}
```

说明：

- ~表示正则匹配，也就是说后面的内容可以是正则表达式匹配
- 第一个点.表示任意字符
- *表示一个或多个字符

### 6.1.2 方式二 在nginx.conf 的location中配置静态资源所在目录实现

例如：当访问静态资源，则从linux服务器/opt/static目录下获取

```nginx
location ~.*/(js|css|img|images) {
	root /opt/static;
}
```

将静态资源放入/opt/static目录下，然后用户访问时由nginx返回这些静态资源

# 7 虚拟主机

1. 虚拟主机就，把一台物理服务器划分成多个“虚拟”的服务器，这样一台物理服务器可以当作多个服务器来使用，从而可以配置多个网站
2. nginx提供虚拟主机功能，为了不需要安装多个nginx就可以运行多个域名不同的网站
3. nginx下，一个server标签就是一个虚拟主机。nginx的虚拟主机就是通过nginx.conf中server节点指定的，想要设置多个虚拟主机，配置多个server节点即可

## 7.1 配置虚拟主机方式

### 7.1.1 基于端口的虚拟主机

基于端口的虚拟主机配置，使用端口来区分

浏览器使用同一个域名+端口 或 同一个ip地址+端口访问；

```nginx
server {
	listen 8080;
    server_name www.myweb.com;
    location /myweb {
        proxy_pass http://www.myweb.com;
    }
}
server {
	listen 9090;
    server_name www.myweb.com;
    location /p2p {
        proxy_pass http://www.p2p.com;
    }
}
```

### 7.1.2 基于域名的虚拟主机（常用）

```nginx
server {
	listen 80;
    server_name www.myweb.com;
    location /myweb {
        proxy_pass http://www.myweb.com;
    }
}
server {
	listen 80;
    server_name www.p2p.com;
    location /p2p {
        proxy_pass http://www.p2p.com;
    }
}
```

### 7.1.3 demo

```nginx
upstream www.beijing.myweb.com {
    server 192.168.115.128:8081
}
upstream www.tianjing.myweb.com {
    server 192.168.115.128:8082
}
upstream www.nanjing.myweb.com {
    server 192.168.115.128:8083
}

server {
	listen 80;
    server_name www.beijing.myweb.com;
    location / {
        proxy_pass http://www.beijing.myweb.com;
    }
}
server {
	listen 80;
    server_name www.tianjing.myweb.com;
    location / {
        proxy_pass http://www.tianjing.myweb.com;
    }
}
server {
	listen 80;
    server_name www.nanjing.myweb.com;
    location / {
        proxy_pass http://www.nanjing.myweb.com;
    }
}
```

# 8 解决跨域

例子：

```nginx
server {
    listen 80;
    server_name localhost;
    
    #允许跨域请求的域，*代表所有
    add_header 'Access-Control-Allow-Origin' *;
    #允许带上cookie请求
    add_header 'Access-Control-Allow-Credentials' 'true';
    #允许请求的方法，如: GET/POST/PUT/DELETE
    add_header 'Access-Control-Allow-Methods' *;
    #允许请求的header
    add_header 'Access-Control-Allow-Headers' *;
    
}
```

# 9 资源防盗链配置

```nginx
server {
    listen 80;
    server_name localhost;
    # 对资源站点验证
    valid_referers *.imooc.com;
    # 非法引入会进入下方判断
    if ($invalid_referer) {
        return 404;
    }
    
}
```

# 10 缓存控制

1. 控制浏览器端缓存

```nginx
location /static {
    alias /home/imooc;
    # d h m s
    expires 10s
    expires @22h30m;
    expires -1h;
    expires epoch;
    expires off;#即默认
    expires max;#永不过期
}
```

2. 反向代理缓存

   ```nginx
   #proxy_cache_path 设置缓存保存的目录
   #	keys_zone	设置缓存名及占用空间的大小
   #	max_size	设置缓存大小
   #	inactive	超过此时间则缓存自动清理
   #	use_temp_path	关闭临时目录
   
   proxy_cache_path /usr/local/nginx/upsteam_cache keys_zone=mycache:5m max_size=1g inactive=30s use_temp_path=off;
   
   server {
       listen 80;
       server_name localhost;
       #开启并使用缓存
       proxy_cache mycache;
       # 针对200和304状态吗的缓存设置过期时间
       proxy_cache_valid	200 304 8h;
   }
   ```

# 11 使用nginx配置SSL证书提供HTTPS访问

1. 安装nginx ssl模块
2. 上传密钥证书和key文件
3. 添加ssl配置

