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
    // Choose a suitable chunk size
    // const chunkSize = 10_000;
    // const totalUsers = 1_000_000;
    const chunkSize = 100;
    const totalUsers = 1000;
    const users = [];

    for (let i = 0; i < totalUsers; i++) {
      const randomName = faker.internet.username();
      const randomPassword = faker.internet.password();

      users.push({
        username: randomName,
        password: randomPassword,
      });

      // Insert in chunks
      if (users.length === chunkSize) {
        console.log('Inserting chunk Number:', i / chunkSize);
        console.log('Percentage done:', (i / totalUsers) * 100 + '%');
        await this.usersRepository.insert(users);
        users.length = 0; // clear the array
      }
    }

    // Insert any remaining users
    if (users.length > 0) {
      await this.usersRepository.insert(users);
    }

    return 'done';
  }
}
