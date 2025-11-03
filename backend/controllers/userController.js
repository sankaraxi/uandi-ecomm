const AdminUser = require("../models/userModel.js");
const Role = require("../models/roleModel.js");

exports.getAllUsers = async (req, res) => {
  try {
    const roleFilter = req.query.role || null;
    const users = await AdminUser.getAllUsers(roleFilter);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAllRoles();
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    await AdminUser.updateUserRole(userId, roleId);
    res.json({ message: "Role updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update role" });
  }
};

exports.assignMember = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      return res.status(400).json({ error: "userId and roleId are required" });
    }

    await AdminUser.updateUserRole(userId, roleId);

    res.json({ message: "User assigned successfully" });
  } catch (err) {
    console.error("Error assigning member:", err);
    res.status(500).json({ error: "Failed to assign member" });
  }
};
