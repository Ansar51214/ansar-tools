
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogSection() {
  const blogs = [
    {
      title: "How to Resize a Photo Without Losing Quality",
      category: "Image Editing",
      date: "Oct 12, 2026",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80",
      link: "#"
    },
    {
      title: "How to Edit a PDF Document Online for Free",
      category: "Productivity",
      date: "Oct 10, 2026",
      image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=400&q=80",
      link: "#"
    },
    {
      title: "Mastering AI Prompts: A Beginner's Guide",
      category: "Artificial Intelligence",
      date: "Oct 08, 2026",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80",
      link: "#"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Insights</h2>
          <p className="text-gray-600">Tips, tutorials, and guides to boost your productivity.</p>
        </div>
        <Link href="#" className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
          <Link key={index} href={blog.link} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gray-200 animate-pulse" /> {/* Placeholder while loading */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600">
                {blog.category}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-sm text-gray-500 mb-2">{blog.date}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {blog.title}
              </h3>
              <div className="mt-auto flex items-center text-blue-600 font-medium text-sm">
                Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center sm:hidden">
        <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-medium border border-blue-200 px-6 py-2 rounded-full">
          View All Insights
        </Link>
      </div>
    </section>
  );
}
