import AppLayout from "@/components/layout/AppLayout";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <AppLayout>
      <div className="container mx-auto px-6">
        <div className="glass rounded-2xl p-10 mt-6">
          <h1 className="font-orbitron text-3xl mb-3">{title}</h1>
          <p className="text-white/70">
            This page is ready to be built next. Tell me what content and
            actions you want here, and I will implement it.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
