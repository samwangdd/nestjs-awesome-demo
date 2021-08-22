import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { deepTransformToHump } from '@/utils/conversionName';

export interface Response<T> {
  data: T;
  errcode: number;
  errmsg: string;
}

/**
 * 全局拦截器
 * 用于请求成功后，返回包装数据
 */
@Injectable()
export class ResultInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // 下划线转驼峰
        const raw = deepTransformToHump(
          // REVIEW: 需要深拷贝，否则操作数据结果中包含异常属性，如 Doc, $init
          JSON.parse(JSON.stringify(data)) as any,
        );
        return {
          data: raw,
          errcode: 0,
          errmsg: '请求成功',
        };
      }),
    );
  }
}
