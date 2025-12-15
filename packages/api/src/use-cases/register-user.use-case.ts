// User registration use case
import { UserRepository } from '../repositories/user.repository';
import { PasswordUtil } from '../utils/password.util';
import { JWTUtil } from '../utils/jwt.util';
import { AppError } from '../middleware/error-handler';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ user: { id: string; email: string; name: string | null }; token: string }> {
    // Validate email format
    if (!this.isValidEmail(data.email)) {
      throw new AppError(400, 'Invalid email format');
    }

    // Validate password strength
    const passwordValidation = PasswordUtil.validate(data.password);
    if (!passwordValidation.valid) {
      throw new AppError(400, passwordValidation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(data.password);

    // Create user
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    // Generate JWT token
    const token = JWTUtil.generateToken({
      userId: user.id,
      email: user.email,
    });

    // Return user (without password) and token
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}


