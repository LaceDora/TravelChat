interface Props {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode; // Cho phép truyền icon tiêu đề nếu muốn
}

export default function ProfileSection({ title, children, icon }: Props) {
  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        {/* Điểm nhấn màu xanh ở đầu tiêu đề */}
        <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">
          {title}
        </h3>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>

      <div
        className="
        grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 
        bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm
      "
      >
        {children}
      </div>
    </section>
  );
}
