import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { title } from 'process';
import { LikesService } from 'src/likes/likes.service';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';

@Injectable()
export class ArticlesService {

  private usersRepository;

  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    private dataSource: DataSource,
    private likesService: LikesService,
    private commentsService: CommentsService
  ) {
    this.usersRepository = dataSource.getRepository(User);
  }

  async create(createArticleDto: CreateArticleDto, reqUser) {

    const user = await this.usersRepository.findOneBy({ id: reqUser.sub });

    const article = this.articlesRepository.create({
        title: createArticleDto.title,
        body: createArticleDto.body,
        user,
    });

    await this.articlesRepository.save(article);
  }

  async toggleLike(id: number, reqUser) {
    const user = await this.usersRepository.findOneBy({ id: reqUser.sub });
    const article = await this.articlesRepository.findOneBy({ id });

    const res = await this.likesService.toggleLike(article, user);

    return res;
  }

  async findAll() {
    const articles = await this.articlesRepository.find({ relations: ['user'], select: { user: { id: true, username: true }} } );
    return articles;
  }

  async findOne(id: number) {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['user', 'likes'], // Specify the relations you need
  });

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    await this.articlesRepository.update(id, updateArticleDto);

    const updatedArticle = await this.articlesRepository.findOneBy({ id });

    return updatedArticle;
  }

  async remove(id: number) {
    await this.articlesRepository.delete(id);

    return `This action removes a #${id} article`;
  }

  async createComment(createCommentDto: CreateCommentDto, reqUser, articleId: number) {

    const user = await this.usersRepository.findOneBy({ id: reqUser.sub });
    const article = await this.articlesRepository.findOneBy({ id: articleId });

    const comment = await this.commentsService.create(createCommentDto, user, article);

    return comment;
  }

  async updateComment(updateCommentDto: UpdateCommentDto, reqUser, id: number) {

    const user = await this.usersRepository.findOneBy({ id: reqUser.sub });

    const comment = await this.commentsService.update(id, updateCommentDto, user);

    return comment;
  }

  async deleteComment(reqUser, id: number) {

    const user = await this.usersRepository.findOneBy({ id: reqUser.sub });

    const comment = await this.commentsService.remove(id, user);

    return comment;
  }
}
