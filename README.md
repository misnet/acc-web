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
3. ssa: 是否是单应用模式，单应用模式下，目前的菜单如果要权限控制需要修改.umirc.ts文件，增加access属性，如access:'canView'
3. 请在根目录创建.env文件，内容输入
```
UMI_ENV=prod
API_HOST=http://你的后端服务域名
```
prod表示正式，test表示测试，如有更多环境需求，请在根目录创建.umirc.环境名.ts，然后UMI_ENV=环境名

## Docker
本项目也可用docker运行，Dockerfile在根目录，docker build后再运行，端口为8080

## 演示地址
https://acc.kity.me

测试账号：dev
密码：podorn123456