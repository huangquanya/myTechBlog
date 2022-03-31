---
title: 电脑上配置github和gitlab的ssh
author: 好运来
date: '2022-3-30'
---
# 电脑上配置github和gitlab的ssh key

## 1. 什么是ssh

*SSH* 为 Secure Shell 的缩写，*SSH* 为建立在应用层基础上的安全协议。*SSH* 是较可靠，专为远程登录会话和其他网络服务提供安全性的协议。利用 *SSH* 协议可以有效防止远程管理过程中的信息泄露问题。

## 2. git中使用的ssh

### **基于密匙的安全验证**

需要依靠[密匙](https://baike.baidu.com/item/密匙)，也就是你必须为自己创建一对密匙，并把公用密匙放在需要访问的git服务器上。如果你要连接到SSH服务器上，客户端软件就会向服务器发出请求，请求用你的密匙进行安全验证。服务器收到请求之后，先在该服务器上你的主目录下寻找你的公用密匙，然后把它和你发送过来的公用密匙进行比较。如果两个密匙一致，服务器就用公用密匙加密“质询”（challenge）并把它发送给客户端软件。客户端软件收到“质询”之后就可以用你的私人密匙解密再把它发送给服务器。

这种方式加密所有传送的数据，而且“中间人”这种攻击方式也是不可能的（因为他没有你的私人密匙）。

## 3. 如何生成ssh key

1. 打开git bash窗口

   ```bash
   ssh-keygen -t rsa -C "xxx@xx.com" -f ~/.ssh/id_rsa
   ```

   window环境下，此时就会在是目录C:\Users\Admin\\.ssh\下，生成id_rsa文件(私钥)和id_rsa.pub文件(公钥)

2. 查看公钥和私钥

   ```bash
   # 查看公钥
   cat ~/.ssh/id_rsa.pub
   # 查看私钥
   cat ~/.ssh/id_rsa
   ```

这样我们就生成了ssh密钥对

## 4. 配置git 和 gitlab的HOST

1. 进入git安装目录下 ~\Git\etc\ssh\

2. 打开ssh_config文件 在文件最下方新增如下代码

```
#根据git和gitlab不同的域名配置私钥
# gitlab
Host gitlab.com
    HostName git.xxx.com
    PreferredAuthentications publickey
    # 填入生成的gitlab私钥
    IdentityFile ~/.ssh/id_rsa_gitlab
# github
Host github.com
    HostName github.com
    PreferredAuthentications publickey
    # 填入生成的github私钥
    IdentityFile ~/.ssh/id_rsa_github
```

## 5. 在Github 和GitLab上面配置ssh秘钥

1. github主页-》setting-》SSH -》new SSH key

2. gitLab主页-》setting-》SSH -》new SSH key

3. 将git和gitLab的各自的公钥填入，确认

4. 测试配置是否成功

   ```bash
   # 测试gitlab
   ssh -T git@git.xxx.com
   # 测试github
   ssh -T git@github.com
   ```

这时我们就完成git和gitlab的ssh key配置