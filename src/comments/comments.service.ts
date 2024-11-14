import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User, article: Article) {
    const comment = await this.commentsRepository.create({
      body: createCommentDto.body,
      user,
      article
    });

    await this.commentsRepository.save(comment);

    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: User) {
    const existingComment = await this.commentsRepository.findOne({
        where: { id },
        relations: ['user'], // Include the user relation to ensure proper comparison
    });

    if (!existingComment) {
        throw new Error(`Comment with ID ${id} not found`);
    }

    // Check if the current user is the owner of the comment
    if (existingComment.user.id !== user.id) {
        throw new Error('You do not have permission to update this comment');
    }

    // Update the comment properties
    existingComment.body = updateCommentDto.body;

    // Save the updated comment
    await this.commentsRepository.save(existingComment);

    return existingComment; // Return the updated comment or any suitable response
  }

  async remove(id: number, user: User) {
    const existingComment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user'], // Include the user relation to ensure proper comparison
  });

    if (!existingComment) {
        throw new Error(`Comment with ID ${id} not found`);
    }

    // Check if the current user is the owner of the comment
    if (existingComment.user.id !== user.id) {
        throw new Error('You do not have permission to update this comment');
    }

    await this.commentsRepository.delete(id);

    return `This action removes a #${id} comment`;
  }
}
