function ProfileData({ data }) {
  return (
    <div className="space-y-3">
      {[
        { label: "Name", value: data.name },
        { label: "Last name", value: data.lastName },
        { label: "Email", value: data.email }
      ].map(row => (
        <div
          key={row.label}
          className="flex items-center justify-between rounded-xl border border-ink/5 bg-white/60 px-4 py-3"
        >
          <span className="text-sm font-medium text-ink-mute">{row.label}</span>
          <p className="max-w-[60%] break-all text-right text-sm font-semibold text-ink">
            {row.value || <span className="font-normal text-ink-mute">Not set</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProfileData;
