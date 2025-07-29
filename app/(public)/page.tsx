import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navigation */}
      <header className="w-full bg-white shadow-sm p-4 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Image
            src="/logo_only.png" // Replace with your actual logo
            alt="ArahSekolah Logo"
            width={40}
            height={40}
            className="mr-2"
            priority
          />
          <span className="text-xl font-bold text-primary">ArahSekolah</span>
        </div>
        <nav className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/sign-in" className="text-gray-700 hover:text-primary transition-colors">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up" className="bg-primary hover:bg-primary-dark text-white transition-colors">Sign Up</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center p-8 bg-gradient-to-r from-blue-50 to-blue-100 text-center lg:text-left">
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start mb-8 lg:mb-0">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Discover Bandung&apos;s <span className="text-primary">Best Elementary Schools</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-xl mb-8">
            ArahSekolah helps parents in Bandung find, review, and easily register their children at top elementary schools, ensuring the best start to their education journey.
          </p>
          <div className="flex space-x-4">
            <Button asChild className="bg-primary hover:bg-primary-dark text-white text-lg px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105">
              <Link href="/dashboard/list">Explore Schools</Link>
            </Button>
            <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary/10 text-lg px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <Image
            src="/pupils-reading-book-classroom-lower.png" // Example hero illustration, replace with a relevant image
            alt="School illustration"
            width={1000}
            height={600}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* Features Section (Optional but Recommended) */}
      <section className="py-16 px-8 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Choose ArahSekolah?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center p-6 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex justify-center items-center mb-4">
              <Image src="/file.svg" alt="Find Schools" width={60} height={60} />
            </CardHeader>
            <CardTitle className="text-2xl font-semibold mb-2 text-primary">Comprehensive Listings</CardTitle>
            <CardDescription className="text-gray-600">
              Browse through a wide range of elementary schools with detailed profiles.
            </CardDescription>
          </Card>
          <Card className="text-center p-6 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex justify-center items-center mb-4">
              <Image src="/window.svg" alt="Read Reviews" width={60} height={60} />
            </CardHeader>
            <CardTitle className="text-2xl font-semibold mb-2 text-primary">Authentic Reviews</CardTitle>
            <CardDescription className="text-gray-600">
              Read honest reviews from other parents to make informed decisions.
            </CardDescription>
          </Card>
          <Card className="text-center p-6 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex justify-center items-center mb-4">
              <Image src="/vercel.svg" alt="Easy Registration" width={60} height={60} />
            </CardHeader>
            <CardTitle className="text-2xl font-semibold mb-2 text-primary">Streamlined Process</CardTitle>
            <CardDescription className="text-gray-600">
              Connect directly with schools and simplify your registration process.
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-8 bg-primary text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Find the Perfect School?</h2>
        <p className="text-lg mb-8 opacity-90">
          Join ArahSekolah today and take the first step towards your child&apos;s bright future.
        </p>
        <Button asChild className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105">
          <Link href="/auth/sign-up">Sign Up Now</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} ArahSekolah. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link href="#" className="hover:underline">Privacy Policy</Link>
          <Link href="#" className="hover:underline">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}