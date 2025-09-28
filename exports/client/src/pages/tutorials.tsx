import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TutorialLauncher from "@/components/TutorialLauncher";

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        <TutorialLauncher />
      </main>
      
      <Footer />
    </div>
  );
}