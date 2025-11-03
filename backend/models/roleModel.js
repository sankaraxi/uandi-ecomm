const pool = require('../config/database');

class Role {

  static async getAllRoles() {
    const [rows] = await pool.query(`SELECT * FROM roles`);
    return rows;
  }

};

module.exports = Role;