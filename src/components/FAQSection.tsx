'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "Are these tools 100% free?",
      answer: "Yes! All tools on Ansar Tools are completely free to use. There are no hidden fees, premium subscriptions, or paywalls."
    },
    {
      question: "Are my documents safe?",
      answer: "Absolutely. We prioritize your privacy. Most of our tools process files locally within your browser, meaning your data never leaves your device or gets uploaded to any server."
    },
    {
      question: "Is there any watermark added to processed files?",
      answer: "No, we never add watermarks to your processed images, PDFs, or documents. You get exactly what you create, completely clean."
    },
    {
      question: "Do I need to create an account to use the tools?",
      answer: "No registration or sign-up is required. You can start using all our tools instantly without providing any personal information."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600">Got questions? We've got answers.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
              openIndex === index ? 'border-blue-500 shadow-md bg-white' : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
            >
              <span className={`font-semibold text-lg ${openIndex === index ? 'text-blue-600' : 'text-gray-800'}`}>
                {faq.question}
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  openIndex === index ? 'transform rotate-180 text-blue-500' : ''
                }`} 
              />
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
