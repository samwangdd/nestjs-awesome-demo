import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

const statusInfo = {
  [HttpStatus.BAD_REQUEST]: '缺少参数或类型错误',
  [HttpStatus.NOT_FOUND]: '无效地址',
};

const BUSINESS_EXCEPTION = 410; // 业务异常

export class BusinessException extends HttpException {
  constructor(message = '数据不存在') {
    super(message, BUSINESS_EXCEPTION);
  }
}

export class ForbiddenException extends HttpException {
  constructor() {
    super('无权访问', HttpStatus.FORBIDDEN);
  }
}

export class UnAuthException extends HttpException {
  constructor() {
    super('未登录', HttpStatus.UNAUTHORIZED);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const message = exception.message;
    Logger.error(message, request.url, 'HTTP 请求错误');

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      data: {},
      errcode: 1, // 自定义 code
      errmsg: statusInfo[status] || message,
    };

    const response = ctx.getResponse();
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.header('Access-Control-Allow-Origin', '*');
    response.send(errorResponse);
  }
}
