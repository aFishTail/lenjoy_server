SELECT
      topic.id AS topic_id,
      topic.title AS topic_title,
      topic.content AS topic_content,
      topic.recommand AS topic_recommand,
      topic.view_count AS topic_view_count,
      topic.comment_count AS topic_comment_count,
      topic.like_count AS topic_like_count,
      topic.favorite_count AS topic_favorite_count,
      topic.last_comment_time AS topic_last_comment_time,
      topic.last_comment_user AS topic_last_comment_user,
      topic.user_agent AS topic_user_agent,
      topic.ip AS topic_ip,
      topic.user_id AS topic_user_id,
      topic.create_at AS topic_create_at,
      topic.update_at AS topic_update_at,
      topic.categoryId AS topic_categoryId,
      category.id AS category_id,
      category.name AS category_name,
      category.label AS category_label,
      user.id AS user_id,
      user.username AS user_username,
      user.avatar AS user_avatar
    FROM
      topic topic
      LEFT JOIN category category ON category.id = topic.categoryId
      LEFT JOIN user user ON user.id = topic.user_id 
    ORDER BY
      topic.create_at DESC