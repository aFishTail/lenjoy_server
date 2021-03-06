import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, QueryBuilder, Repository } from 'typeorm';
import { Topic } from '../topic/entities/topic.entity';
import {
  CreateCommentToCommentDto,
  CreateTopicCommentDto,
} from './dto/create-comment.dto';
import {
  DelCommentToCommentDto,
  DelTopicCommentDto,
} from './dto/del-comment.dto copy';
import {
  QuerySubCommentListDto,
  QueryTopicCommentListDto,
} from './dto/query-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  /**
   * 添加文章的一级评论
   */
  async addTopicComment(userId: string, p: CreateTopicCommentDto) {
    const { entityId, content } = p;
    await getManager().transaction(async (manager) => {
      await manager.getRepository(Comment).create({
        userId,
        entityId,
        content,
      });
      await manager.increment(Topic, { id: entityId }, 'comment_count', 1);
    });
    return null;
  }

  /**
   * 删除文章的一级评论
   */
  async delTopicComment(userId: string, p: DelTopicCommentDto) {
    const { entityId } = p;
    await getManager().transaction(async (manager) => {
      await manager.getRepository(Comment).delete(entityId);
      await manager.decrement(Topic, { id: entityId }, 'comment_count', 1);
    });
    return null;
  }

  /**
   * 添加子级评论
   * @returns
   */
  async addCommentToComment(userId: string, p: CreateCommentToCommentDto) {
    const { entityId, content, parentCommentId } = p;
    await this.commentRepository.create({
      userId,
      entityId,
      content,
      quoteId: parentCommentId,
    });
    return null;
  }

  /**
   * 删除子级评论
   * @returns
   */
  async delCommentToComment(userId: string, p: DelCommentToCommentDto) {
    const { id } = p;
    await this.commentRepository.delete(id);
    return null;
  }

  /**
   * 获取帖子下的评论列表
   */
  async getCommentList(userId: string, p: QueryTopicCommentListDto) {
    const { topicId, pageNum, pageSize } = p;
    const qb = this.commentRepository
      .createQueryBuilder()
      .select()
      .where('entityType = topic')
      .andWhere('entity_id = :id', { id: topicId })
      .take(pageSize)
      .skip(pageNum * (pageNum - 1));

    const [total, records] = await qb.getManyAndCount();
    return {
      records,
      total,
    };
  }

  // TODO: 未完成！
  async getSubCommentList(userId: string, p: QuerySubCommentListDto) {
    const { commentId, pageNum, pageSize } = p;
    const qb = this.commentRepository
      .createQueryBuilder()
      .select()
      .where('entityId = :entityId', { entityId: commentId })
      .take(pageSize)
      .skip(pageNum * (pageNum - 1));
    const [total, records] = await qb.getManyAndCount();
    return {
      records,
      total,
    };
  }
}
