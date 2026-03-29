interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ProfileSection({ title, children }: Props) {
  return (
    <section className="mb-10">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </section>
  );
}
