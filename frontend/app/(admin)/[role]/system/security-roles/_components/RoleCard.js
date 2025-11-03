export default function RoleCard({ title, value }) {
  return (
    <div className="p-4 border rounded-xl text-center bg-white shadow-sm">
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-gray-500">{title}</p>
    </div>
  );
}
