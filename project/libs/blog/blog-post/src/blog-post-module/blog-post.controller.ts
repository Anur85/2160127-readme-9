import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';

  import { fillDto } from '@project/helpers';
  import { CommentRdo, CreateCommentDto } from '@project/blog-comment';

  import { BlogPostService } from './blog-post.service';
  import { BlogPostRdo } from './rdo/blog-post.rdo';
  import { BlogPostQuery } from './blog-post.query';
  import { BlogPostWithPaginationRdo } from './rdo/blog-post-with-pagination.rdo';
  import { CreatePostDto } from './dto/create-post.dto';
  import { UpdatePostDto } from './dto/update-post.dto';

  @ApiTags('posts')
  @Controller('posts')
  export class BlogPostController {
    constructor (
      private readonly blogPostService: BlogPostService,
    ) {}


    @Get('/:id')
    public async show(@Param('id') id: string) {
      const post = await this.blogPostService.getPost(id);
      return fillDto(BlogPostRdo, post.toPOJO());
    }

    @Get('/')
    public async index(@Query() query: BlogPostQuery) {
      const postsWithPagination = await this.blogPostService.getAllPosts(query);
      const result = {
        ...postsWithPagination,
        entities: postsWithPagination.entities.map((post) => post.toPOJO()),
      }
      return fillDto(BlogPostWithPaginationRdo, result);
    }

    @Post('/')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(BlogPostRdo, newPost.toPOJO());
  }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async destroy(@Param('id') id: string) {
      await this.blogPostService.deletePost(id);
    }

    @Patch('/:id')
    public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
      const updatedPost = await this.blogPostService.updatePost(id, dto);
      return fillDto(BlogPostRdo, updatedPost.toPOJO());
    }

    @Post('/:postId/comments')
  public async createComment(@Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    const newComment = await this.blogPostService.addComment(postId, dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }
  }
