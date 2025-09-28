import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowLeft, Briefcase, TrendingUp, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const ConsultingGuide = () => {
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
            Consulting Resume Masterclass
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            How to craft a consulting resume that demonstrates problem-solving and client impact.
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-8">
            <User className="w-4 h-4 mr-2" />
            <span className="mr-4">Eliya Khajeie</span>
            <Clock className="w-4 h-4 mr-2" />
            <span>10 min read</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Consulting</Badge>
            <Badge variant="outline">Problem Solving</Badge>
            <Badge variant="outline">McKinsey</Badge>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">The MBB Formula for Consulting Resumes</h2>

            <p className="text-gray-700 mb-6">
              McKinsey, Bain, and BCG look for specific qualities in resumes. Your resume needs to demonstrate analytical thinking,
              leadership impact, and quantifiable business results. Every bullet point should follow the "So what?" test.
            </p>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">The Consulting "So What?" Test:</h3>
              <div className="space-y-3 text-sm">
                <div>✅ <strong>Good:</strong> "Increased client revenue by $2M through supply chain optimization"</div>
                <div>❌ <strong>Bad:</strong> "Worked on supply chain project for automotive client"</div>
                <div className="text-blue-700 font-medium">Ask yourself: "So what? Why should they care about this achievement?"</div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Essential Consulting Resume Structure</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Education First (Usually)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Top consulting firms are prestige-focused. Lead with education if you have:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Top 20 MBA or undergraduate degree</li>
                    <li>• High GPA (3.7+ undergrad, 3.5+ MBA)</li>
                    <li>• Relevant honors, leadership roles, or case competitions</li>
                  </ul>
                  <div className="bg-gray-50 p-4 rounded mt-4">
                    <p className="text-sm font-medium">Example:</p>
                    <p className="text-sm mt-1">Harvard Business School, MBA, 2023 | GPA: 3.8<br/>
                    • President, Consulting Club (150+ members)<br/>
                    • Winner, National Case Competition (1st place out of 50 teams)</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Professional Experience with Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Each role should demonstrate consulting core skills:</p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-blue-600">Problem Solving</h4>
                      <p>Analytical thinking, data analysis, hypothesis-driven approach</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-600">Leadership</h4>
                      <p>Team management, influence without authority, change management</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-600">Client Impact</h4>
                      <p>Revenue growth, cost reduction, process improvement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Power Verbs for Consulting Resumes</h2>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <h4 className="font-medium text-sm mb-2 text-blue-600">Analysis</h4>
                <ul className="text-xs space-y-1">
                  <li>• Analyzed</li>
                  <li>• Diagnosed</li>
                  <li>• Evaluated</li>
                  <li>• Assessed</li>
                  <li>• Investigated</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium text-sm mb-2 text-green-600">Strategy</h4>
                <ul className="text-xs space-y-1">
                  <li>• Developed</li>
                  <li>• Designed</li>
                  <li>• Formulated</li>
                  <li>• Strategized</li>
                  <li>• Architected</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium text-sm mb-2 text-purple-600">Implementation</h4>
                <ul className="text-xs space-y-1">
                  <li>• Executed</li>
                  <li>• Implemented</li>
                  <li>• Delivered</li>
                  <li>• Launched</li>
                  <li>• Deployed</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium text-sm mb-2 text-red-600">Leadership</h4>
                <ul className="text-xs space-y-1">
                  <li>• Led</li>
                  <li>• Managed</li>
                  <li>• Coordinated</li>
                  <li>• Influenced</li>
                  <li>• Facilitated</li>
                </ul>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Consulting Achievement Formula</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">Structure: [Action] + [Context] + [Method] + [Result] + [Impact]</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Example 1 (Strategy Consulting):</p>
                  <p>"<span className="text-blue-600">Analyzed</span> market entry strategy for <span className="text-green-600">Fortune 500 retail client</span> using <span className="text-purple-600">competitive benchmarking and customer segmentation</span>, resulting in <span className="text-red-600">$15M revenue opportunity identification</span> and <span className="text-orange-600">successful expansion into 3 new markets</span>"</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Example 2 (Operations):</p>
                  <p>"<span className="text-blue-600">Led</span> operational due diligence for <span className="text-green-600">$200M acquisition in healthcare</span> by <span className="text-purple-600">conducting process mapping and cost analysis</span>, identifying <span className="text-red-600">$8M in synergies</span> and <span className="text-orange-600">enabling successful deal closure</span>"</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Industry-Specific Consulting Examples</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💼 Management Consulting</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• "Developed cost reduction strategy for manufacturing client, identifying $12M in savings through supply chain optimization and workforce restructuring"</p>
                  <p>• "Led post-merger integration planning for 2 telecom companies, designing operating model that achieved 95% of targeted synergies within 18 months"</p>
                  <p>• "Analyzed customer retention for SaaS startup, implementing data-driven pricing strategy that increased LTV by 35% and reduced churn by 20%"</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏥 Healthcare Consulting</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• "Optimized patient flow for 500-bed hospital system, reducing average length of stay by 1.2 days and improving patient satisfaction scores by 15%"</p>
                  <p>• "Conducted market assessment for medical device company, identifying $50M market opportunity in emerging therapeutic area"</p>
                  <p>• "Designed value-based care model for health plan, projecting 12% reduction in medical costs while maintaining quality metrics"</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💰 Financial Services</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• "Restructured investment banking division for mid-tier firm, increasing revenue per banker by 40% through portfolio optimization"</p>
                  <p>• "Led digital transformation strategy for community bank, designing omnichannel experience that increased mobile adoption by 60%"</p>
                  <p>• "Analyzed credit risk modeling for fintech startup, implementing ML algorithms that reduced default rates by 25%"</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">McKinsey PST & Case Interview Skills</h2>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-yellow-900 mb-4">💡 Show Case Interview Skills in Your Experience</h3>
                <div className="space-y-3 text-sm text-yellow-800">
                  <div><strong>Hypothesis-driven thinking:</strong> "Hypothesized that customer churn was driven by onboarding issues, validated through user interviews and reduced churn by 30%"</div>
                  <div><strong>Structured problem-solving:</strong> "Segmented market opportunity by geography, customer size, and product fit to prioritize $20M expansion strategy"</div>
                  <div><strong>Data synthesis:</strong> "Synthesized findings from 50+ stakeholder interviews and financial analysis to recommend acquisition target"</div>
                  <div><strong>MECE frameworks:</strong> "Analyzed revenue decline across 4 key drivers: pricing, volume, mix, and market share, identifying pricing as primary factor"</div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Common Consulting Resume Mistakes</h2>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Generic Business Language</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>Wrong:</strong> "Improved business processes and increased efficiency"</p>
                  <p className="text-green-800 text-sm"><strong>Right:</strong> "Redesigned procurement process using lean methodology, reducing cycle time by 40% and saving $2M annually"</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Focusing on Tasks Instead of Impact</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>Wrong:</strong> "Created PowerPoint presentations for client meetings"</p>
                  <p className="text-green-800 text-sm"><strong>Right:</strong> "Presented strategic recommendations to C-suite, securing $5M investment in digital transformation initiative"</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Weak Leadership Examples</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>Wrong:</strong> "Worked with team to complete project on time"</p>
                  <p className="text-green-800 text-sm"><strong>Right:</strong> "Managed cross-functional team of 12 across 3 time zones, delivering complex integration project 2 weeks ahead of schedule despite scope changes"</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Ready for MBB Recruiting?</h2>
                <p className="text-blue-800 mb-6">
                  Use our consulting-specific templates and examples from successful MBB hires.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/templates">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Browse Consulting Templates
                    </Button>
                  </Link>
                  <Link to="/resumes">
                    <Button variant="outline" size="lg">
                      See MBB Examples
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

export default ConsultingGuide;