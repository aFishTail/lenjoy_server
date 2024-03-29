import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Topic } from '../topic/entities/topic.entity';
import {
  CreateCommentToCommentDto,
  CreateTopicCommentDto,
} from './dto/create-comment.dto';
import {
  DelCommentToCommentDto,
  DelTopicCommentDto,
} from './dto/del-comment.dto';
import { QueryTopicCommentListDto } from './dto/query-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private dataSource: DataSource,
  ) {}

  /**
   * 添加文章的一级评论
   */
  async addComment(userId: string, p: CreateTopicCommentDto) {
    const { entityId, content, entityType } = p;
    await this.dataSource.transaction(async (manager) => {
      const comment = await manager.getRepository(Comment).create({
        userId,
        entityId,
        content,
        entityType,
      });
      await manager.getRepository(Comment).save(comment);
      await manager.increment(Topic, { id: entityId }, 'commentCount', 1);
    });
    return null;
  }

  /**
   * 删除文章的一级评论
   */
  async delTopicComment(userId: string, p: DelTopicCommentDto) {
    const { entityId } = p;
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Comment).delete({ entityId });
      await manager.decrement(Topic, { id: entityId }, 'commentCount', 1);
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
    const { entityId, entityType, pageNum, pageSize } = p;
    const qb = this.commentRepository
      .createQueryBuilder('comment')
      .orderBy('comment.createAt', 'ASC')
      .leftJoinAndMapOne(
        'comment.user',
        'user',
        'user',
        'user.id = comment.userId',
      )
      .andWhere('entity_id = :entityId', { entityId })
      .andWhere('entity_type = :entityType', { entityType })
      .take(pageSize)
      .skip(pageSize * (pageNum - 1));

    const [records, total] = await qb.getManyAndCount();
    return {
      records,
      total,
    };
  }

  // TODO: 未完成！
  // async getSubCommentList(userId: string, entityId: string, quoteId: string) {
  //   const { commentId, pageNum, pageSize } = p;
  //   const qb = this.commentRepository
  //     .createQueryBuilder()
  //     .select()
  //     .where('entityId = :entityId', { entityId, quoteId })
  //     .take(pageSize)
  //     .skip(pageNum * (pageNum - 1));
  //   const [total, records] = await qb.getManyAndCount();
  //   return {
  //     records,
  //     total,
  //   };
  // }
}
