"use client";

import { useDispatch } from "react-redux";
import { updateUserRole } from "@/store/roleSlice";

export default function RoleTable({ users, roles }) {
  const dispatch = useDispatch();

  const handleRoleChange = (userId, roleId) => {
    dispatch(updateUserRole({ userId, roleId }));
  };

  return (
    <table className="w-full text-left border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Role</th>
          <th className="p-3">Added On</th>
          <th className="p-3">Status</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.user_id} className="border-t hover:bg-gray-50">
            <td className="p-3">{u.first_name} {u.last_name}</td>
            <td className="p-3">{u.email}</td>
            <td className="p-3">
              <select
                value={roles.find(r => r.role_name === u.role_name)?.role_id || ""}
                onChange={(e) => handleRoleChange(u.user_id, e.target.value)}
                className="border rounded px-2 py-1"
              >
                {roles.map(role => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </td>
            <td className="p-3">{new Date(u.created_at).toLocaleDateString()}</td>
            <td className="p-3">
              <span className={`px-3 py-1 rounded-full text-sm ${
                u.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}>
                {u.is_active ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="p-3 text-red-500 cursor-pointer hover:underline">
              Remove
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
