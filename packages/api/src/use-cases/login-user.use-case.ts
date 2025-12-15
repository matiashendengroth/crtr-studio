// User login use case
import { UserRepository } from '../repositories/user.repository';
import { PasswordUtil } from '../utils/password.util';
import { JWTUtil } from '../utils/jwt.util';
import { AppError } from '../middleware/error-handler';

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: {
    email: string;
    password: string;
  }): Promise<{ user: { id: string; email: string; name: string | null }; token: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

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
}


