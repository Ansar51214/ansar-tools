import { Search } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function Hero({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }: HeroProps) {
  const filters = ["All Tools", "PDFs", "AI Prompts", "Image Tools"];

  return (
    <section className="w-full py-20 px-4 flex flex-col items-center justify-center rounded-b-[3rem] shadow-lg mb-12" style={{ background: 'linear-gradient(135deg, #09396F 20%, #4088AD 95%)' }}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#F0E8F1] mb-8 text-center tracking-tight">
        Ansar Tools for <span className="bg-gradient-to-r from-white via-orange-400 to-white bg-clip-text text-transparent bg-[length:200%_auto] animate-[flowText_7s_linear_infinite]">Smart Person</span>
      </h1>
      
      <div className="w-full max-w-3xl relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 rounded-full border-0 text-gray-900 placeholder-gray-500 bg-white shadow-md focus:ring-2 focus:ring-orange-500 text-lg transition-all"
          placeholder="Search tools, PDFs, AI prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full font-medium transition-all shadow-sm
              ${activeFilter === filter 
                ? 'bg-white text-blue-900' 
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}
