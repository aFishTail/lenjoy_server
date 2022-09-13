import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { QueryCategoryListInputDto } from './dto/query-category.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 添加分类
   * @param category
   */
  async create(category: Partial<Category>) {
    const { name } = category;
    const existCategory = await this.categoryRepository.findOne({
      where: { name },
    });
    if (existCategory) {
      throw new HttpException('分类已存在', HttpStatus.BAD_REQUEST);
    }
    const newCategory = await this.categoryRepository.create(category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async findAll(payload: QueryCategoryListInputDto) {
    const { name, startTime, endTime } = payload;
    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('category.createAt', 'ASC')
      .leftJoinAndSelect('category.topics', 'topic');

    if (name) {
      qb.andWhere('category.name LIKE :name', { name: `%${name}%` });
    }
    if (startTime && endTime) {
      qb.andWhere('category.create_at BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });
    }

    const data = await qb.getMany();
    return data;
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOne({ id });
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    const oldData = await this.categoryRepository.findOne({
      id: updateCategoryDto.id,
    });
    const newData = {
      ...oldData,
      ...updateCategoryDto,
    };
    const updatedData = this.categoryRepository.merge(oldData, newData);
    return this.categoryRepository.save(updatedData);
  }

  async delete(id: string) {
    const data = await this.categoryRepository.findOne({ id });
    this.categoryRepository.remove(data);
  }

  /**
   * 获取指定分类
   * @param id
   */
  async findById(id): Promise<Category> {
    const data = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id=:id')
      .setParameter('id', id)
      .getOne();

    return data;
  }
}
