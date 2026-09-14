import { Monitor, FileText, BarChart, BookOpen } from "lucide-react";
import Link from "next/link";

const ecosystems = [
  {
    title: "Ansar Computer Lab",
    description: "Learn computer basics, typing, and advanced programming for free.",
    icon: <Monitor className="w-8 h-8 text-blue-600" />,
    link: "#",
    btnText: "Visit Lab"
  },
  {
    title: "Ansar Resume",
    description: "Professional ATS-friendly resume builder with premium templates.",
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    link: "#",
    btnText: "Build Resume"
  },
  {
    title: "Ansar Results",
    description: "Check your academic and competitive exam results instantly.",
    icon: <BarChart className="w-8 h-8 text-blue-600" />,
    link: "#",
    btnText: "View Results"
  },
  {
    title: "Ansar Test",
    description: "Practice mock tests for various competitive exams for free.",
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
    link: "#",
    btnText: "Take Test"
  }
];

export default function EcosystemSection() {
  return (
    <section className="py-16 bg-gray-50 rounded-[3rem] my-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Ecosystem</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our interconnected platforms designed to provide you with comprehensive digital solutions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ecosystems.map((item, index) => (
          <div key={index} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-6 flex-grow">{item.description}</p>
            <Link 
              href={item.link}
              className="inline-block border border-blue-100 text-blue-600 px-6 py-2 rounded-full font-medium text-sm hover:bg-blue-50 transition-colors w-full"
            >
              {item.btnText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
