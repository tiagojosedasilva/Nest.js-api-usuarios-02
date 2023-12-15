import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class LogInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        
        const dt = Date.now()
        const request = context.switchToHttp().getRequest()
        return next.handle().pipe(tap(() => {
            console.log(`A execução levou ${Date.now() - dt} milisegundos`);
            console.log(`URL: ${request.url}, with method:${request.method}`);
        }))
    }
}