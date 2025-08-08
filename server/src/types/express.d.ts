import { User } from '@suban/shared';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {}; 