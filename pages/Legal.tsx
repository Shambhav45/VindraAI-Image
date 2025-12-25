import React from 'react';

const Legal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Legal Information</h1>

      <section className="mb-12 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Terms of Service</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p className="mb-4">Welcome to Vindra AI. By using our service, you agree to these terms.</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>You own the images you generate. We claim no copyright over your creations.</li>
            <li>You must not generate illegal, harmful, hateful, or NSFW content.</li>
            <li>We reserve the right to suspend accounts that abuse the credit system or violate content policies.</li>
            <li>Credits purchased are non-refundable unless required by law.</li>
            <li>Service uptime is not guaranteed (99.9% target).</li>
          </ul>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p className="mb-4">Your privacy is important to us.</p>
          <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Data Collection</h3>
          <p className="mb-4">We collect your email for authentication and account management via Google Firebase. We store your generated images and text prompts to provide the service history.</p>
          
          <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">AI Processing</h3>
          <p className="mb-4">Text prompts are sent to Google Gemini AI for processing. Please review Google's privacy policy regarding AI interactions.</p>

          <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Advertising</h3>
          <p className="mb-4">We use Google AdSense to serve ads. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</p>
          
          <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">Contact</h3>
          <p>For data deletion requests, contact shambhavjha3@gmail.com.</p>
        </div>
      </section>
    </div>
  );
};

export default Legal;