import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('test')
  findOneByUsername(@Query('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Public()
  @Post('/fillUsers')
  async fillUsers() {
    await this.usersService.fillUsers();
    
    return { Message: "users add successfully" }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Public()
  @Post(':id/follow/:followId')
  async followUser(
    @Param('id') id: number,
    @Param('followId') followId: number,
  ) {
    await this.usersService.followUser(id, followId);
    return { message: 'User followed successfully' };
  }

  @Public()
  @Delete(':id/unfollow/:unfollowId')
  async unfollowUser(
    @Param('id') id: number,
    @Param('unfollowId') unfollowId: number,
  ) {
    await this.usersService.unfollowUser(id, unfollowId);
    return { message: 'User unfollowed successfully' };
  }

  @Public()
  @Get(':id/followers')
  async getFollowers(@Param('id') id: number) {
    return this.usersService.getFollowers(id);
  }

  @Public()
  @Get(':id/following')
  async getFollowing(@Param('id') id: number) {
    return this.usersService.getFollowing(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
