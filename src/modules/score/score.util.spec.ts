import { EntityTypeEnum } from 'src/common/constants';
import {
  ScoreConfig,
  ScoreOperateOption,
  ScoreOperateType,
} from './score.type';
import {
  getOpScoreAndDesc,
  getOperateDesc,
  getOperateScore,
} from './score.util';

describe('Score Service', () => {
  describe('test getOperateScore', () => {
    expect(getOperateScore(EntityTypeEnum.Topic)).toBe(ScoreConfig.PostTopic);
  });

  describe('test getOperateDesc', () => {
    const cases = [
      {
        type: ScoreOperateType.INCREASE,
        entityType: EntityTypeEnum.Topic,
        expect: '发布帖子',
      },
      {
        type: ScoreOperateType.DECREASE,
        entityType: EntityTypeEnum.Topic,
        expect: '删除帖子',
      },
      {
        type: ScoreOperateType.INCREASE,
        entityType: EntityTypeEnum.Reward,
        expect: '发布悬赏',
      },
      {
        type: ScoreOperateType.DECREASE,
        entityType: EntityTypeEnum.Reward,
        expect: '删除悬赏',
      },
    ];
    expect(getOperateDesc(cases[0].type, cases[0].entityType)).toBe(
      cases[0].expect,
    );
    expect(getOperateDesc(cases[1].type, cases[1].entityType)).toBe(
      cases[1].expect,
    );
  });

  describe('getOpScoreAndDesc', () => {
    const cases = [
      {
        typeOption: ScoreOperateType.INCREASE,
        entityType: EntityTypeEnum.Topic,
        score: ScoreConfig.PostTopic,
        desc: '发布帖子',
      },
      {
        typeOption: ScoreOperateType.DECREASE,
        entityType: EntityTypeEnum.Topic,
        score: ScoreConfig.PostTopic,
        desc: '删除帖子',
      },
      {
        typeOption: {
          type: ScoreOperateType.INCREASE,
          score: 100,
          desc: '发布悬赏',
        },
        entityType: EntityTypeEnum.Reward,
      },
    ];
    it('increase operate', () => {
      const { score, desc } = getOpScoreAndDesc(
        cases[0].typeOption,
        cases[0].entityType,
      );
      expect(score).toBe(cases[0].score);
      expect(desc).toBe(cases[0].desc);
    });
    it('decrease operate', () => {
      const { score, desc } = getOpScoreAndDesc(
        cases[1].typeOption,
        cases[1].entityType,
      );
      expect(score).toBe(cases[1].score);
      expect(desc).toBe(cases[1].desc);
    });
    it('test with scoreOption', () => {
      const typeOption = cases[2].typeOption as ScoreOperateOption;
      const { type, score, desc } = getOpScoreAndDesc(
        typeOption,
        cases[2].entityType,
      );
      expect(type).toBe(typeOption.type);
      expect(score).toBe(typeOption.score);
      expect(desc).toBe(typeOption.desc);
    });
  });
});
