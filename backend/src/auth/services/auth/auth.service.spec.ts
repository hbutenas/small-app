import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserDto } from 'src/auth/dto';
import { User } from 'src/auth/types';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthService } from './auth.service';

// email is the  unique key
// will use email as the key to find the user

describe('AuthService', () => {
  let service: AuthService;

  const mockUserDatabase = [];

  const mockPrismaService = {
    User: {
      findUnique: jest.fn((params) => {
        const i = mockUserDatabase.findIndex((user) => user.email === params.where.email);
        if (i === -1) return null;
        return mockUserDatabase[i];
      }),
      create: jest.fn((user) => {
        mockUserDatabase.push({
          ...user.data,
          refreshToken: null,
        });
        return user;
      }),
      update: jest.fn((params) => {
        const i = mockUserDatabase.findIndex((user) => user.email === params.where.email);
        if (i === -1) return null;
        mockUserDatabase[i] = {
          ...mockUserDatabase[i],
          ...params.data,
        };
        return mockUserDatabase[i];
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: new JwtService(),
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user', async () => {
    const mockUserDTO: RegisterUserDto = {
      email: 'user1@gmail.com',
      password: 'user1password',
    };

    const user: User = await service.register(mockUserDTO);
    console.log(mockUserDatabase);
    expect(user).toBeDefined();
  });

  it('should not register existing user', async () => {
    const mockUserDTO: RegisterUserDto = {
      email: 'user1@gmail.com',
      password: 'user1password',
    };

    await expect(service.register(mockUserDTO)).rejects.toThrow();
  });

  it('should login user', async () => {
    const mockUserDTO: RegisterUserDto = {
      email: 'user1@gmail.com',
      password: 'user1password',
    };

    const user: User = await service.login(mockUserDTO);
    expect(user).toBeDefined();
  });

  it('should not login user', async () => {
    const mockUserDTO: RegisterUserDto = {
      email: 'user1@gmail.com',
      password: 'wrong password',
    };

    await expect(service.login(mockUserDTO)).rejects.toThrow();
  });

  it('should logout user', () => {
    const isLoggedOut = service.logout('user1@gmail.com');
    expect(mockUserDatabase[0].refreshToken).toBeNull();
    expect(isLoggedOut).toBeTruthy();
  });
});
