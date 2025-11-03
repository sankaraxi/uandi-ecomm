"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchRoles, fetchCustomers, assignMember } from "@/store/roleSlice";
import Swal from "sweetalert2";
import RoleCard from "./_components/RoleCard";
import RoleTable from "./_components/RoleTable";

export default function SecurityRoles() {
  const dispatch = useDispatch();
  const { users, roles, customers } = useSelector((state) => state.roles);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleAssignClick = async () => {
    // await dispatch(fetchCustomers());
    const customerOptions = customers.map((c) => ({
      text: `${c.first_name} ${c.last_name} (${c.email})`,
      value: c.user_id,
    }));

    const roleOptions = roles
      .filter((r) => r.role_name !== "Customer")
      .map((r) => ({
        text: r.role_name,
        value: r.role_id,
      }));

    const { value: userId } = await Swal.fire({
      title: "Select a Customer",
      input: "select",
      inputOptions: Object.fromEntries(customerOptions.map(c => [c.value, c.text])),
      inputPlaceholder: "Choose a customer",
      showCancelButton: true,
    });

    if (!userId) return;

    const { value: roleId } = await Swal.fire({
      title: "Assign Role",
      input: "select",
      inputOptions: Object.fromEntries(roleOptions.map(r => [r.value, r.text])),
      inputPlaceholder: "Choose role",
      showCancelButton: true,
    });

    if (!roleId) return;

    dispatch(assignMember({ userId, roleId }));
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Admin Members</h1>
          <p className="text-gray-600">Manage Admin Accounts and Permissions</p>
        </div>
        <button
          onClick={handleAssignClick}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          + Assign Member
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <RoleCard title="Total Members" value={users.length} />
        <RoleCard title="Active Members" value={users.filter(u => u.is_active).length} />
        <RoleCard title="Super Admin" value={users.filter(u => u.role_name === "Super Admin").length} />
        <RoleCard title="Admin" value={users.filter(u => u.role_name === "Admin").length} />
      </div>

      <RoleTable users={users} roles={roles} />
    </div>
  );
}
