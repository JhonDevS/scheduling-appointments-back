const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../dao/userDao');
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const userDao = require('../../dao/userDao');
const userService = require('../../services/userService');

describe('UserService', () => {
  let hashSpy;
  let compareSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    hashSpy = jest.spyOn(bcrypt, 'hash');
    compareSpy = jest.spyOn(bcrypt, 'compare');
  });

  afterEach(() => {
    hashSpy.mockRestore();
    compareSpy.mockRestore();
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = {
        id: 'uuid-123',
        email,
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userDao.findByEmail.mockResolvedValue(null);
      userDao.create.mockResolvedValue(mockUser);
      hashSpy.mockResolvedValue('hashed_password');

      const result = await userService.register(email, password);

      expect(userDao.findByEmail).toHaveBeenCalledWith(email);
      expect(hashSpy).toHaveBeenCalledWith(password, 10);
      expect(userDao.create).toHaveBeenCalledWith({
        email,
        password: 'hashed_password',
      });
      expect(result.email).toBe(email);
      expect(result.password).toBeUndefined();
    });

    it('should throw error if user already exists', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      userDao.findByEmail.mockResolvedValue({ id: 'existing-uuid', email });

      await expect(userService.register(email, password)).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('login', () => {
    it('should return user and token on successful login', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const mockUser = {
        id: 'uuid-123',
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userDao.findByEmail.mockResolvedValue(mockUser);
      compareSpy.mockResolvedValue(true);

      const result = await userService.login(email, password);

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.user.password).toBeUndefined();
    });

    it('should throw error if user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      userDao.findByEmail.mockResolvedValue(null);

      await expect(userService.login(email, password)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const mockUser = {
        id: 'uuid-123',
        email,
        password: hashedPassword,
      };

      userDao.findByEmail.mockResolvedValue(mockUser);
      compareSpy.mockResolvedValue(false);

      await expect(userService.login(email, password)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      process.env.JWT_SECRET = 'test-secret';
      process.env.JWT_EXPIRES_IN = '1h';

      const userId = 'uuid-123';
      const token = userService.generateToken(userId);

      expect(token).toBeDefined();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(userId);
    });
  });
});
