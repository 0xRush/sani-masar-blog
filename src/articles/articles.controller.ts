import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}


  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @User() user) {
    return this.articlesService.create(createArticleDto, user);
  }

  @UseGuards(AuthGuard)
  @Post(':id/likes')
  toggleLike(@Param('id') articleId: number, @User() user) {
    return this.articlesService.toggleLike(articleId, user);
  }


  @Public()
  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/comments')
  async createComment(@Body() createCommentDto: CreateCommentDto, @User() user, @Param('id') id: number) {
    return await this.articlesService.createComment(createCommentDto, user, id);
  }

  @UseGuards(AuthGuard)
  @Patch(':articleId/comments/:id')
  async updateComment(@Body() updateCommentDto: UpdateCommentDto, @User() user, @Param('id') id: number) {
    return await this.articlesService.updateComment(updateCommentDto, user, id);
  }

  @UseGuards(AuthGuard)
  @Delete(':articleId/comments/:id')
  async deleteComment(@User() user, @Param('id') id: number) {
    return await this.articlesService.deleteComment(user, id);
  }
}
