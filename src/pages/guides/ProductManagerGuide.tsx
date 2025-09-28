import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowLeft, Target, Users, BarChart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const ProductManagerGuide = () => {
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

          <Badge className="mb-4">Industry Specific</Badge>
          <h1 className="text-4xl font-bold text-black mb-4">
            Product Manager Resume Strategy Guide
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Specific strategies for PM resumes, including how to showcase product sense and leadership.
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-8">
            <User className="w-4 h-4 mr-2" />
            <span className="mr-4">Nathan Lee</span>
            <Clock className="w-4 h-4 mr-2" />
            <span>12 min read</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Product Management</Badge>
            <Badge variant="outline">Leadership</Badge>
            <Badge variant="outline">Strategy</Badge>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">What Makes PM Resumes Different</h2>

            <p className="text-gray-700 mb-6">
              Product management resumes require a unique approach. You're not just a project manager or an engineer—you're the
              CEO of your product. Your resume needs to demonstrate strategic thinking, user empathy, data-driven decision making,
              and cross-functional leadership all at once.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Product Sense</h3>
                  <p className="text-sm text-gray-600">Show you understand users and can identify the right problems to solve</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <BarChart className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Data Fluency</h3>
                  <p className="text-sm text-gray-600">Demonstrate ability to make decisions based on metrics and user feedback</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Leadership</h3>
                  <p className="text-sm text-gray-600">Show how you influence without authority and drive results through others</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Essential PM Resume Sections</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Product Impact Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Start with a powerful summary that highlights your product wins:</p>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm font-medium">Example:</p>
                    <p className="text-sm mt-2">"Product Manager with 5+ years driving user growth and revenue at scale. Led products used by 10M+ users, increased engagement by 40%, and launched 3 successful features that generated $2M ARR. Expert in A/B testing, user research, and cross-functional team leadership."</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Product Skills Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Product Strategy:</span> Roadmap planning, OKRs, competitive analysis, market research
                    </div>
                    <div>
                      <span className="font-medium">Analytics:</span> SQL, Mixpanel, Amplitude, Google Analytics, Tableau, A/B testing
                    </div>
                    <div>
                      <span className="font-medium">User Research:</span> User interviews, surveys, usability testing, personas, journey mapping
                    </div>
                    <div>
                      <span className="font-medium">Tools:</span> Jira, Figma, Slack, Notion, ProductBoard, Miro
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">The Product Manager STAR Formula</h2>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">For each product experience, include:</h3>
              <div className="space-y-3 text-sm">
                <div><span className="font-medium text-blue-700">S - Situation:</span> What product/feature were you working on?</div>
                <div><span className="font-medium text-blue-700">T - Task:</span> What specific challenges needed solving?</div>
                <div><span className="font-medium text-blue-700">A - Action:</span> What product decisions did you make and why?</div>
                <div><span className="font-medium text-blue-700">R - Result:</span> How did users and business metrics improve?</div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium mb-3">Example PM Achievement:</h4>
              <p className="text-sm">
                "Led redesign of mobile onboarding flow after identifying 60% drop-off rate in user research.
                Collaborated with design and engineering to implement 3-step simplified flow with progressive disclosure.
                A/B tested with 10,000 users, resulting in 35% increase in completion rate and 20% boost in Day-1 retention,
                adding $500K annual revenue."
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Power Metrics for Product Managers</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">📈 Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Monthly/Daily Active Users (MAU/DAU)</li>
                    <li>• User acquisition cost (CAC)</li>
                    <li>• Conversion rates</li>
                    <li>• Retention rates (D1, D7, D30)</li>
                    <li>• Time to value</li>
                    <li>• Feature adoption rates</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">💰 Business Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Revenue impact (ARR/MRR)</li>
                    <li>• Customer lifetime value (LTV)</li>
                    <li>• Churn reduction</li>
                    <li>• Average order value (AOV)</li>
                    <li>• Time to market</li>
                    <li>• Cost savings achieved</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Common PM Resume Mistakes</h2>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Focusing on Features, Not Outcomes</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>Wrong:</strong> "Launched user dashboard with 5 new widgets"</p>
                  <p className="text-green-800 text-sm"><strong>Right:</strong> "Launched analytics dashboard that reduced customer support tickets by 30% and improved user satisfaction score from 7.2 to 8.4"</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Not Showing Cross-Functional Leadership</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>Wrong:</strong> "Worked with engineering team to build feature"</p>
                  <p className="text-green-800 text-sm"><strong>Right:</strong> "Led cross-functional team of 8 engineers, 2 designers, and 3 data scientists to deliver feature 2 weeks ahead of schedule"</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Missing User-Centric Language</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>Wrong:</strong> "Improved application performance"</p>
                  <p className="text-green-800 text-sm"><strong>Right:</strong> "Reduced app load time by 40% based on user feedback, improving user experience for 100K+ daily active users"</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Industry-Specific Tips</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏢 B2B SaaS PM</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• Emphasize enterprise customer needs</li>
                    <li>• Show understanding of sales cycles</li>
                    <li>• Highlight integrations and scalability</li>
                    <li>• Include ARR and customer expansion metrics</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📱 Consumer/Mobile PM</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• Focus on user engagement and retention</li>
                    <li>• Show understanding of app store optimization</li>
                    <li>• Highlight viral/growth features</li>
                    <li>• Include user acquisition and monetization</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Ready to Land Your Next PM Role?</h2>
                <p className="text-blue-800 mb-6">
                  Use our PM-specific templates and examples from successful product managers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/templates">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Browse PM Templates
                    </Button>
                  </Link>
                  <Link to="/resumes">
                    <Button variant="outline" size="lg">
                      See PM Examples
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

export default ProductManagerGuide;