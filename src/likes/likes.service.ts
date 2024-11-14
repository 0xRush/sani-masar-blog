import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {

  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>
  ) {}

  async toggleLike(article: Article, reqUser: User) {
    const existingLike = await this.likesRepository.findOneBy({ user: reqUser, article: article});

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      return { message: 'Article unliked successfully' };
    }

    const like = this.likesRepository.create({
      user: reqUser,
      article
    });

    await this.likesRepository.save(like);

    return like;
  }
}
