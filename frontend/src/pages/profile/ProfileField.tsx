interface Props {
  label: string;
  value?: string;
  edit?: boolean;
  type?: string;
  onChange?: (v: string) => void;
}

export default function ProfileField({
  label,
  value,
  edit = false,
  type = "text",
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>

      {edit ? (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="
            h-11 px-4 rounded-lg
            border border-gray-300
            bg-white text-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
      ) : (
        <div
          className="
            h-11 px-4 flex items-center
            rounded-lg border border-gray-200
            bg-gray-50 text-gray-800
          "
        >
          {value || "-"}
        </div>
      )}
    </div>
  );
}
