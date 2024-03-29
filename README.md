## 简介
该项目是采用NestJs，TypeOrm+mysql,redis构建的社区论坛后台服务，演示地址：http://81.69.252:6069

### 相关仓库
- 论坛仓库：[https://github.com/aFishTail/lenjoy_client](https://github.com/aFishTail/lenjoy_client)
- 后台管理平台：[https://github.com/aFishTail/lenjoy_admin](https://github.com/aFishTail/lenjoy_admin)
## 设计概要记录

### 验证码

- 首先请求获取id和验证码图片地址，后端生成id及图片，存入reids
- 前端获取图片接口渲染到界面
- 校验

### 邮箱注册

1. 可以直接注册
2. 发表帖子需要经过邮箱认证, emial_verified

### 邮箱认证

1. 设置邮箱
2. 验证邮箱
3. uuid, 验证码存入redis， 发送验证邮件
4. 根据uuid, code 检验验证码是否正确

### 图片上传及静态文件服务

参考[写给初用Nestj做项目的你(三篇: 编写api & 图片上传)](https://segmentfault.com/a/1190000040201949)

### 消息

### swagger

#### 嵌套的dto对象展示

```ts
export class UserLikeOperateOutDto extends ResponseDto {
  @ApiProperty({ type: UserLikeOperateDto })
  data: unknown;
}
```

## 问题记录及解决方法
### server
1. 注册排名怎么计算的，若多用户同时注册时，怎么处理并发？

### client
1. nextjs getServerSideProps 中怎么获取到一些客户端存储到变量，如token， userId

## TODO
- [x] 用户行为通过AOP编程实现
- [x] resource 购买时积分操作
- [x] 发布悬赏时校验当前socre是否满足需要
- [x] 邮件配置提取到配置文件中
- [x] 配置文件可以根据运行环境自动化
- [ ] captcha生成的地址能够正常访问
- [x] qiniu 域名映射
- [x] 敏感key，密钥隐藏
- [ ] 消息模块功能
- [x] 用户发布资源，悬赏时校验email
- [ ] 运行前时初始化admin账号密码（可配置）
- [x] 签到功能
- [x] 自定义execption和业务code，便于前端处理
- [ ] 服务 url 统一
- [ ] nest-cli.json 配置
- [x] jwt secret 提取到配置文件