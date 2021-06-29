import { getCustomRepository } from 'typeorm';
import { UsersRepositories } from '../repositories/UsersRepositories';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    //verificar se email existe
    const user = await usersRepositories.findOne({
      email,
    });

    if (!user) {
      throw new Error('Email/Password incorrect');
    }

    //verificar se a senha está correta
    const passworMatch = await compare(password, user.password);

    if (!passworMatch) {
      throw new Error('Email/Password incorrect');
    }

    //Gerar token
    const token = sign(
      {
        email: user.email,
      },
      'ebe2162d291df333ea82914acc106989',
      {
        subject: user.id,
        expiresIn: '1d',
      }
    );

    return token;
  }
}

export { AuthenticateUserService };
