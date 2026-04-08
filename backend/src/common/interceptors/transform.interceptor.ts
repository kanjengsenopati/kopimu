import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => this.transformData(data)),
    );
  }

  private transformData(data: any): any {
    if (data === null || data === undefined) return data;

    // Handle Array
    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    // Handle Object
    if (typeof data === 'object') {
      // Robust check for Prisma Decimal (works even when minified/obfuscated)
      if (
        data !== null &&
        typeof data.d === 'object' &&
        typeof data.e === 'number' &&
        typeof data.s === 'number'
      ) {
        return Number(data.toString());
      }
      
      // Handle Date
      if (data instanceof Date) {
        return data;
      }

      // Recursively transform object properties
      const transformed: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          transformed[key] = this.transformData(data[key]);
        }
      }
      return transformed;
    }

    return data;
  }
}
