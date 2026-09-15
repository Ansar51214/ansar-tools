import { Zap, ShieldCheck, Gift } from "lucide-react";

export default function WhyChooseSection() {
  const reasons = [
    {
      title: "Zero Wait Time",
      description: "Everything executes right inside your browser engine. Enjoy instant file transformations and zero upload bottlenecks, even on slower connections.",
      icon: <Zap className="w-8 h-8 text-orange-500" />
    },
    {
      title: "Nothing Leaves Your Device",
      description: "Your documents, photos, and personal records stay entirely on your local machine. No remote server storage, no data mining, and zero tracking.",
      icon: <ShieldCheck className="w-8 h-8 text-green-500" />
    },
    {
      title: "No Catch, Ever",
      description: "Every single utility is freely accessible without premium paywalls, sneaky trial periods, artificial watermarks, or sign-up hurdles.",
      icon: <Gift className="w-8 h-8 text-purple-500" />
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Ansar Tools?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Built from the ground up to deliver a clean, lightning-fast, and privacy-first utility experience.
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
