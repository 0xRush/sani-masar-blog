import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findAll() {
    const users = await this.usersRepository.find();

    return users;
  }

  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    return user;
  }

  async createuser(username: string, hashedPassword:string) {
    const existingUser = await this.usersRepository.findOneBy({ username });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async findById(userId: any) {
    return await this.usersRepository.findOneBy({ id: userId });
  }

  async followUser(userId: number, followUserId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    const userToFollow = await this.usersRepository.findOneBy({ id: followUserId});

    if (!user || !userToFollow) {
      throw new Error('User not found');
    }

    user.following.push(userToFollow);
    await this.usersRepository.save(user);
  }

  async unfollowUser(userId: number, unfollowUserId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    if (!user) throw new Error('User not found');

    user.following = user.following.filter(
      (u) => u.id !== unfollowUserId,
    );

    await this.usersRepository.save(user);
  }

  async getFollowers(userId: number): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followers'],
    });

    return user.followers;
  }

  async getFollowing(userId: number): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    return user.following;
  }

  async fillUsers() {
    const chunkSize = 10_000;
    const totalUsers = 1_000_000;
    const users = [];
    const generatedUsernames = new Set(
      (await this.usersRepository.find({ select: ['username'] })).map(user => user.username)
    );
  
    for (let i = 0; i < totalUsers; i++) {
      let randomName;
  
      // Ensure uniqueness
      do {
        randomName = faker.internet.username();
      } while (generatedUsernames.has(randomName));
  
      generatedUsernames.add(randomName); // Mark as used
      const randomPassword = faker.internet.password();
  
      users.push({
        username: randomName,
        password: randomPassword,
      });
  
      if (users.length === chunkSize) {
        try {
          console.log('Inserting chunk Number:', i / chunkSize);
          console.log('Percentage done:', (i / totalUsers) * 100 + '%');
          await this.usersRepository.insert(users);
          users.length = 0; // Clear the array
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry detected. Retrying...');
            // Remove duplicates from `users` and continue
            for (const user of users) {
              generatedUsernames.delete(user.username);
            }
            users.length = 0; // Clear and retry
          } else {
            throw error; // Rethrow unknown errors
          }
        }
      }
    }
  
    // Insert any remaining users
    if (users.length > 0) {
      try {
        await this.usersRepository.insert(users);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.error('Duplicate entry detected. Retrying...');
        } else {
          throw error;
        }
      }
    }
  
    return 'done';
  }  
}
