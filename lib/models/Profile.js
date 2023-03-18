const pool = require('../utils/pool.js');

module.exports = class Profile {
  id;
  display_name;
  bio;
  avatar_image_url;
  dark_mode;
  created_at;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.display_name = row.display_name;
    this.bio = row.bio;
    this.avatar_image_url = row.avatar_image_url;
    this.dark_mode = row.dark_mode;
    this.created_at = row.created_at;
  }

  static async insert({
    user_id,
    displayName,
    bio,
    avatar_image_url,
    dark_mode,
  }) {
    const { rows } = await pool.query(
      `
      INSERT INTO profiles (user_id, display_name, bio, avatar_image_url, dark_mode)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [user_id, displayName, bio, avatar_image_url, dark_mode]
    );

    return new Profile(rows[0]);
  }
};
