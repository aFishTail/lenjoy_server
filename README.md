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
