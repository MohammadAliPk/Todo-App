"use client";

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            First name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="field-input"
            placeholder="Your first name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="field-label">
            Last name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="field-input"
            placeholder="Your last name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          New password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="field-input"
          placeholder="Leave empty to keep current password"
        />
        <p className="mt-1 text-xs text-ink-mute">
          Password is optional. Fill it only if you want to change it.
        </p>
      </div>

      <div className="pt-2">
        <button type="button" onClick={submitHandler} className="btn-primary">
          Save changes
        </button>
      </div>
    </div>
  );
}

export default ProfileForm;
