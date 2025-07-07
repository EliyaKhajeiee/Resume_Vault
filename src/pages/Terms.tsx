import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-black mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Last updated: December 30, 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Agreement to Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Resume Proof's website and services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Description of Service</h2>
            <p className="text-gray-600 mb-4">
              Resume Proof provides a platform for accessing proven resume examples from successful candidates at top companies. Our service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Access to curated resume examples</li>
              <li>Search and filtering capabilities</li>
              <li>Career insights and tips</li>
              <li>Community features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">User Accounts</h2>
            <p className="text-gray-600 mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Acceptable Use</h2>
            <p className="text-gray-600 mb-4">
              You agree not to use the service:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The service and its original content, features, and functionality are and will remain the exclusive property of Resume Proof and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Payment Terms</h2>
            <p className="text-gray-600 mb-4">
              Paid services are billed in advance on a monthly or annual basis. Refunds are handled according to our refund policy. We reserve the right to change our pricing at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              In no event shall Resume Proof, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: legal@resumeproof.com<br />
              Address: [Your Business Address]
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;