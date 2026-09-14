import { Zap, ShieldCheck, Gift } from "lucide-react";

export default function WhyChooseSection() {
  const reasons = [
    {
      title: "Lightning Fast",
      description: "Powered by modern client-side processing, our tools run instantly in your browser without waiting for server uploads.",
      icon: <Zap className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Secure by Design",
      description: "Your files never leave your device. All processing happens locally in your browser, ensuring maximum privacy and data security.",
      icon: <ShieldCheck className="w-8 h-8 text-green-500" />
    },
    {
      title: "Forever Free",
      description: "We believe utility tools should be accessible to everyone. Enjoy all features with no hidden charges, watermarks, or premium limits.",
      icon: <Gift className="w-8 h-8 text-purple-500" />
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Ansar Tools?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Built with modern web technologies to provide you with the best possible experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reasons.map((reason, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
              {reason.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
            <p className="text-gray-600 leading-relaxed">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
