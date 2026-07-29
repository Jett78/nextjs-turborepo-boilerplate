import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ProfileNav } from "@/components/profile/profile-nav";

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 sm:pb-12">
          <div className="flex flex-col sm:flex-row gap-8">
            <aside className="sm:w-64 shrink-0">
              <div className="sm:sticky sm:top-24">
                <ProfileNav />
              </div>
            </aside>
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
