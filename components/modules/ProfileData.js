function ProfileData({ data }) {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <span className="text-sm font-medium text-gray-500">Name</span>
        <p className="text-sm text-gray-800">
          {data.name || <span className="text-gray-400">Not set</span>}
        </p>
      </div>
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <span className="text-sm font-medium text-gray-500">Last name</span>
        <p className="text-sm text-gray-800">
          {data.lastName || <span className="text-gray-400">Not set</span>}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">Email</span>
        <p className="text-sm text-gray-800 break-all">
          {data.email}
        </p>
      </div>
    </div>
  );
}

export default ProfileData;
