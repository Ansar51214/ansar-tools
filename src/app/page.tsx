'use client';

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ToolGrid from "@/components/ToolGrid";
import VisionSection from "@/components/VisionSection";
import EcosystemSection from "@/components/EcosystemSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import BlogSection from "@/components/BlogSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { categories } from "@/data/toolsData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Tools");

  // Filter tools based on search query and active filter
  const filteredCategories = useMemo(() => {
    return categories.map(category => {
      const filteredTools = category.tools.filter(tool => {
        const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              tool.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "All Tools" || tool.category === activeFilter;
        
        return matchesSearch && matchesFilter;
      });
      
      return {
        ...category,
        tools: filteredTools
      };
    }).filter(category => category.tools.length > 0);
  }, [searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-200">
      <Navbar />
      
      <main>
        <Hero 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        
        <section id="tools" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-6 relative z-10 bg-white pt-8 rounded-t-[3rem]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Premium Free Tools</h2>
            <p className="text-gray-500">Everything you need, in one place.</p>
          </div>
          
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <ToolGrid 
                key={index}
                title={category.title}
                icon={category.icon}
                tools={category.tools}
              />
            ))
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-700">No tools found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("All Tools");
                }}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        <VisionSection />
        <EcosystemSection />
        <WhyChooseSection />
        <BlogSection />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
