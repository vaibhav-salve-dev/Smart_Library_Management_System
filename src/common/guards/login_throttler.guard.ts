import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

const requests = new Map<string, number[]>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const email = request.body?.email;
    const key = email || request.ip || request.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60 *  1000; 
    const limit = 5;

    let timestamps = requests.get(key) || [];

    timestamps = timestamps.filter(timestamp => now - timestamp < windowMs);
    
    if (timestamps.length >= limit) {
      const oldestRequest = timestamps[0];
      const timeElapsed = now - oldestRequest;
      const timeRemaining = windowMs - timeElapsed;
      const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000));
      const minutesRemaining = Math.ceil(timeRemaining / (60 * 1000));
      
      console.log(`Rate limit exceeded! Next attempt allowed in ${minutesRemaining} minutes`);
      
      throw new HttpException(
        {
          success: false,
          message: `Too many login attempts. Please try again after ${minutesRemaining} minutes.`,
          remainingTime: minutesRemaining,
          remainingTimeHours: hoursRemaining,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add current request timestamp
    timestamps.push(now);
    requests.set(key, timestamps);
    console.log(`Login allowed. Next attempt allowed after 1 hour`);
    
    return true;
  }
}