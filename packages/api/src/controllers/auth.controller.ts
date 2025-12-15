// Authentication controller
import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { LoginUserUseCase } from '../use-cases/login-user.use-case';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();
const registerUseCase = new RegisterUserUseCase(userRepository);
const loginUseCase = new LoginUserUseCase(userRepository);

export class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required' },
      });
    }

    const result = await registerUseCase.execute({ email, password, name });

    res.status(201).json(result);
  }

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required' },
      });
    }

    const result = await loginUseCase.execute({ email, password });

    res.status(200).json(result);
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response) {
    // With JWT, logout is handled client-side (delete token)
    // Could implement token blacklist here if needed
    res.status(200).json({ message: 'Logged out successfully' });
  }

  /**
   * GET /api/auth/me
   */
  async me(req: Request, res: Response) {
    // User is attached to request by auth middleware
    const userId = (req as any).userId;

    const user = await userRepository.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: { message: 'User not found' },
      });
    }

    // Return user without password
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  }
}


