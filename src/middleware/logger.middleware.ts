import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const code = res.statusCode;
  next();
  // 组装日志信息
  const logFormat = ` \n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
   Type: Request
   Request original url: ${req.originalUrl}
   Method: ${req.method}
   IP: ${req.ip}
   Status code: ${code}
   Parmas: ${JSON.stringify(req.params)}
   Query: ${JSON.stringify(req.query)}
   Body: ${JSON.stringify(
     req.body,
   )} \n  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 `;
  // 根据状态码进行日志类型区分
  if (code >= 500) {
    Logger.error(logFormat);
  } else if (code >= 400) {
    Logger.warn(logFormat);
  } else {
    console.log('请求正确', code);
    Logger.log(logFormat);
  }
}
