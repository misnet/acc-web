# ACC-Web
本项目基于umijs+antd设计，提供基于多个应用统一集中管理的权限系统。

主要功能包括：

- 应用管理：管理多个应用

- 用户管理：用户信息管理以及针对用户的角色分配等

- 角色管理：多角色权限控制，包括角色用户授权、角色菜单授权、权限资源管理以及权限资源授权

- 菜单管理：多级菜单配置管理

- 配置管理：提供统一的key——value形式的配置管理，应用可以通过api取得需要的配置项与值

## 项目特点：
- 可以授权一个账号在不同的应用中登陆
- 不同的应用可以有自己独立的权限控制
- 基于角色的权限控制，允许多角色权限重叠与交叉

## 相关技术
- antd 5.4.x
- umijs/max 4.3.x
- antd/pro-components 2.4.x

## 配置说明
相关参数在 src/constants/index.ts中定义，主要包括：
1. SYS_CONFIG.appKey:  必须和服务端的ACC系统的应用id 一致
2. SYS_CONFIG.lang:  默认zh_CN，这个是服务端处理信息的语种，支持zh_CN和en_US
3. API_HOST: 分开发环境和正式环境，可分别配置，默认为开发环境，要用正式环境时请在根目录创建.env文件，内容输入UMI_ENV=prod，系统即可变成正式环境，API_HOST到时会就用正式环境的

## Docker
本项目也可用docker运行，Dockerfile在根目录，docker build后再运行，端口为8080

## 演示地址
https://acc.kity.me

测试账号：dev
密码：podorn123456