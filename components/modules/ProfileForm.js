function ProfileForm({
  name,
  lastName,
  password,
  setName,
  setLastName,
  setPassword,
  submitHandler
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            placeholder="Your first name"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={e => {
              setLastName(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            placeholder="Your last name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          New password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          placeholder="Leave empty to keep current password"
        />
        <p className="mt-1 text-xs text-gray-400">
          Password is optional. Fill it only if you want to change it.
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={submitHandler}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full md:w-auto"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

export default ProfileForm;
