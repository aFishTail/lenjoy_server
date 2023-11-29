import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryUser } from 'src/decorators/user.decorator';
import { CommentService } from './comment.service';
import { CreateTopicCommentDto } from './dto/create-comment.dto';
import { QueryTopicCommentListDto } from './dto/query-comment.dto';

@ApiTags('评论管理')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('add')
  addTopic(@Body() payload: CreateTopicCommentDto, @QueryUser('id') userId) {
    return this.commentService.addComment(userId, payload);
  }

  @Post('del')
  delTopic(@Body() payload: CreateTopicCommentDto, @QueryUser('id') userId) {
    return this.commentService.addComment(userId, payload);
  }

  // @Post('add/comment')
  // addComent(
  //   @Body() payload: CreateCommentToCommentDto,
  //   @QueryUser('id') userId,
  // ) {
  //   return this.commentService.addComment(userId, payload);
  // }

  // @Post('del/comment')
  // delComent(@Body() payload: DelCommentToCommentDto, @QueryUser('id') userId) {
  //   return this.commentService.delCommentToComment(userId, payload);
  // }

  @Post('list')
  listTopic(
    @Body() payload: QueryTopicCommentListDto,
    @QueryUser('id') userId,
  ) {
    return this.commentService.getCommentList(userId, payload);
  }
}
