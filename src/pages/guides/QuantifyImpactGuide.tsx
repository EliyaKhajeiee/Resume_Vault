import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowLeft, CheckCircle, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const QuantifyImpactGuide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-4xl mx-auto px-4">
          <Link to="/guides" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guides
          </Link>

          <Badge className="mb-4">Resume Writing</Badge>
          <h1 className="text-4xl font-bold text-black mb-4">
            How to Quantify Your Impact on Your Resume
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Learn how to turn your accomplishments into compelling, measurable results that recruiters love.
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-8">
            <User className="w-4 h-4 mr-2" />
            <span className="mr-4">Eliya Khajeie</span>
            <Clock className="w-4 h-4 mr-2" />
            <span>8 min read</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Metrics</Badge>
            <Badge variant="outline">Impact</Badge>
            <Badge variant="outline">Results</Badge>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">

          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• The STAR method for quantifying achievements</li>
                <li>• 50+ power metrics that impress recruiters</li>
                <li>• How to find numbers when you think you don't have any</li>
                <li>• Industry-specific quantification strategies</li>
                <li>• Common mistakes that kill your credibility</li>
              </ul>
            </CardContent>
          </Card>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Why Numbers Matter More Than Ever</h2>

            <p className="text-gray-700 mb-6">
              In today's competitive job market, hiring managers spend an average of 6 seconds scanning each resume.
              Quantified achievements grab attention immediately and provide concrete proof of your value.
            </p>

            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">Before vs. After Examples:</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-red-600 mb-1">❌ Vague:</p>
                  <p className="text-sm">Improved website performance</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">✅ Quantified:</p>
                  <p className="text-sm">Optimized website loading speed by 45%, resulting in 23% increase in user engagement and $50K additional monthly revenue</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">The Ultimate Metrics Toolkit</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💰 Financial Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Revenue generated/increased</li>
                    <li>• Costs reduced/saved</li>
                    <li>• Budget managed</li>
                    <li>• ROI percentage</li>
                    <li>• Profit margins improved</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📊 Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Efficiency improvements (%)</li>
                    <li>• Error rates reduced</li>
                    <li>• Processing time decreased</li>
                    <li>• Quality scores increased</li>
                    <li>• Productivity gains</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">👥 People & Scale</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Team size managed</li>
                    <li>• Users/customers served</li>
                    <li>• Projects completed</li>
                    <li>• Stakeholders engaged</li>
                    <li>• Training sessions delivered</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">⏱️ Time & Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Deadlines met/beaten</li>
                    <li>• Turnaround time reduced</li>
                    <li>• Volume of work handled</li>
                    <li>• Frequency of tasks</li>
                    <li>• Timeline compression</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Finding Numbers When You Think You Don't Have Any</h2>

            <div className="space-y-6">
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-yellow-900 mb-3">💡 Pro Tip: Ask These Questions</h3>
                  <ul className="text-yellow-800 space-y-2 text-sm">
                    <li>• How many people were affected by my work?</li>
                    <li>• How much time did I save the company/team?</li>
                    <li>• What was the before and after state?</li>
                    <li>• How does my performance compare to others?</li>
                    <li>• What would have happened without my contribution?</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Real Examples by Role:</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium">Software Engineer:</h4>
                    <p>Developed automation script that reduced manual testing time from 8 hours to 30 minutes, saving 15 developer hours per week</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Marketing Manager:</h4>
                    <p>Launched email campaign that generated 1,200 qualified leads and contributed to 15% increase in Q3 sales ($75K revenue)</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Customer Support:</h4>
                    <p>Maintained 98% customer satisfaction rating while handling 50+ tickets daily, 20% above team average</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">The IMPACT Formula</h2>

            <div className="bg-blue-50 p-8 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">I-M-P-A-C-T</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">I</div>
                  <div>
                    <h4 className="font-semibold">Identify the metric</h4>
                    <p className="text-sm text-gray-600">What specific number can you measure?</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">M</div>
                  <div>
                    <h4 className="font-semibold">Measure the change</h4>
                    <p className="text-sm text-gray-600">What was before vs. after?</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">P</div>
                  <div>
                    <h4 className="font-semibold">Provide context</h4>
                    <p className="text-sm text-gray-600">What was the timeframe and scope?</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">A</div>
                  <div>
                    <h4 className="font-semibold">Add business value</h4>
                    <p className="text-sm text-gray-600">Why did this matter to the company?</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">C</div>
                  <div>
                    <h4 className="font-semibold">Compare to benchmarks</h4>
                    <p className="text-sm text-gray-600">How does this compare to industry standards?</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-1">T</div>
                  <div>
                    <h4 className="font-semibold">Tell the story</h4>
                    <p className="text-sm text-gray-600">Connect it to a larger narrative</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-900">⚠️ Quantification Mistakes to Avoid</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-red-800 space-y-2 text-sm">
                  <li>• Using fake or inflated numbers</li>
                  <li>• Providing metrics without context</li>
                  <li>• Focusing on effort instead of results</li>
                  <li>• Using vague percentages like "significantly increased"</li>
                  <li>• Forgetting to explain why the metric matters</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Ready to Quantify Your Success?</h2>
                <p className="text-blue-800 mb-6">
                  Use our templates to create a metrics-driven resume that gets results.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/templates">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Browse Templates
                    </Button>
                  </Link>
                  <Link to="/resumes">
                    <Button variant="outline" size="lg">
                      See Examples
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuantifyImpactGuide;