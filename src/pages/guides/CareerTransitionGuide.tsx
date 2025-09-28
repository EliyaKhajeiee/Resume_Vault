import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowLeft, ArrowRight, Target, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const CareerTransitionGuide = () => {
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

          <Badge className="mb-4">Career Strategy</Badge>
          <h1 className="text-4xl font-bold text-black mb-4">
            Career Transition Resume Strategy
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            How to position yourself when changing industries or roles.
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-8">
            <User className="w-4 h-4 mr-2" />
            <span className="mr-4">Eliya Khajeie</span>
            <Clock className="w-4 h-4 mr-2" />
            <span>11 min read</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Career Change</Badge>
            <Badge variant="outline">Transition</Badge>
            <Badge variant="outline">Strategy</Badge>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">The Career Transition Challenge</h2>

            <p className="text-gray-700 mb-6">
              Changing careers is one of the most challenging resume situations. You're competing against candidates with direct
              experience while trying to convince employers that your different background is actually an advantage.
              The key is strategic positioning and transferable skills highlighting.
            </p>

            <Card className="bg-yellow-50 border-yellow-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <Lightbulb className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">The Transition Mindset</h3>
                    <p className="text-yellow-800 text-sm">
                      Don't apologize for your career change. Instead, position it as bringing unique value and fresh perspective.
                      Your diverse background is a strength, not a weakness.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Types of Career Transitions</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">🔄 Industry Transition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Same role, different industry</p>
                  <div className="text-sm space-y-1">
                    <div><strong>Example:</strong> Marketing Manager</div>
                    <div>Healthcare → Tech</div>
                    <div><strong>Strategy:</strong> Emphasize transferable marketing skills while learning industry-specific knowledge</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">🎯 Function Transition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Same industry, different role</p>
                  <div className="text-sm space-y-1">
                    <div><strong>Example:</strong> Engineer → Product Manager</div>
                    <div>Same tech company</div>
                    <div><strong>Strategy:</strong> Leverage industry knowledge while highlighting relevant PM skills</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-600">⚡ Complete Pivot</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Different industry AND role</p>
                  <div className="text-sm space-y-1">
                    <div><strong>Example:</strong> Teacher → UX Designer</div>
                    <div>Education → Tech</div>
                    <div><strong>Strategy:</strong> Focus on universal skills and relevant projects/education</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">📈 Level Transition</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Moving up or down hierarchy levels</p>
                  <div className="text-sm space-y-1">
                    <div><strong>Example:</strong> Senior IC → Manager</div>
                    <div>Same company/industry</div>
                    <div><strong>Strategy:</strong> Highlight leadership experience and management potential</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">The Transferable Skills Framework</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 1: Skills Audit & Mapping</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded mb-4">
                    <h4 className="font-medium mb-3">Universal Skills Categories:</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-blue-700">Leadership</h5>
                        <ul className="space-y-1">
                          <li>• Team management</li>
                          <li>• Project coordination</li>
                          <li>• Conflict resolution</li>
                          <li>• Decision making</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-700">Communication</h5>
                        <ul className="space-y-1">
                          <li>• Presentation skills</li>
                          <li>• Written communication</li>
                          <li>• Stakeholder management</li>
                          <li>• Training/mentoring</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-purple-700">Problem Solving</h5>
                        <ul className="space-y-1">
                          <li>• Analytical thinking</li>
                          <li>• Process improvement</li>
                          <li>• Data analysis</li>
                          <li>• Strategic planning</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 2: Skill Translation Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="font-medium mb-2">Teacher → Product Manager</h4>
                      <div className="space-y-1">
                        <div><strong>Curriculum design</strong> → Product roadmap planning</div>
                        <div><strong>Student assessment</strong> → User research and feedback analysis</div>
                        <div><strong>Parent communication</strong> → Stakeholder management</div>
                        <div><strong>Classroom management</strong> → Cross-functional team leadership</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="font-medium mb-2">Military → Business Analyst</h4>
                      <div className="space-y-1">
                        <div><strong>Mission planning</strong> → Project management and strategic planning</div>
                        <div><strong>Intelligence analysis</strong> → Data analysis and reporting</div>
                        <div><strong>Team leadership</strong> → Cross-functional collaboration</div>
                        <div><strong>Resource management</strong> → Budget planning and optimization</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Resume Structure for Career Changers</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Powerful Summary Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Your summary should bridge your past and future, emphasizing transferable value:</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-1">❌ Weak Transition Summary:</p>
                      <div className="bg-red-50 p-3 rounded text-sm">
                        "Experienced teacher looking to transition into product management. Eager to learn and grow in a new field."
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">✅ Strong Transition Summary:</p>
                      <div className="bg-green-50 p-3 rounded text-sm">
                        "Results-driven educator with 8+ years designing learning experiences for diverse audiences. Proven track record in user research, curriculum development, and stakeholder management. Seeking to leverage analytical skills and user-centric mindset in product management role."
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Skills-Forward Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Lead with relevant skills rather than chronological experience:</p>
                  <div className="bg-blue-50 p-4 rounded">
                    <h4 className="font-medium mb-3">Example Skills Section for Teacher → UX Designer:</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Design & Research:</strong> User empathy, persona development, learning path design, feedback analysis</div>
                      <div><strong>Tools:</strong> Figma, Adobe Creative Suite, Google Analytics, Miro, Notion</div>
                      <div><strong>Methodology:</strong> Design thinking, agile methodology, user-centered design, iterative improvement</div>
                      <div><strong>Soft Skills:</strong> Stakeholder communication, cross-functional collaboration, problem-solving</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">The Project Portfolio Strategy</h2>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-900 mb-4">💡 Bridge the Gap with Relevant Projects</h3>
                <div className="space-y-3 text-sm text-green-800">
                  <div><strong>Side projects:</strong> Build portfolio pieces that demonstrate target role skills</div>
                  <div><strong>Volunteer work:</strong> Find non-profit opportunities in your target field</div>
                  <div><strong>Freelance/consulting:</strong> Take small projects to gain relevant experience</div>
                  <div><strong>Online courses:</strong> Complete certifications and showcase learnings through projects</div>
                  <div><strong>Internal projects:</strong> Lead initiatives at current job that align with target role</div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Industry-Specific Transition Strategies</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💻 Breaking into Tech</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div><strong>Key requirements:</strong> Technical literacy, problem-solving mindset, adaptability</div>
                    <div><strong>Bridge skills:</strong> Data analysis, project management, user empathy</div>
                    <div><strong>Proof points:</strong> Coding bootcamp completion, personal projects, tech certifications</div>
                    <div><strong>Network:</strong> Tech meetups, online communities, informational interviews</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏥 Healthcare Transition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div><strong>Key requirements:</strong> Regulatory knowledge, attention to detail, patient-first mindset</div>
                    <div><strong>Bridge skills:</strong> Quality assurance, documentation, compliance experience</div>
                    <div><strong>Proof points:</strong> Healthcare certifications, volunteer experience, industry research</div>
                    <div><strong>Network:</strong> Healthcare conferences, professional associations, hospital volunteer work</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💰 Financial Services Entry</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div><strong>Key requirements:</strong> Analytical skills, risk assessment, regulatory awareness</div>
                    <div><strong>Bridge skills:</strong> Quantitative analysis, client relationship management, detail orientation</div>
                    <div><strong>Proof points:</strong> CFA/FRM certifications, financial modeling projects, investment research</div>
                    <div><strong>Network:</strong> CFA Society events, finance alumni networks, fintech meetups</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Common Transition Mistakes</h2>

            <div className="space-y-4">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Apologizing for Your Background</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>Wrong:</strong> "Although I don't have direct experience in tech..."</p>
                  <p className="text-green-800 text-sm"><strong>Right:</strong> "Bringing fresh perspective from education sector with proven track record in user-centered design..."</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Generic Application Approach</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>Wrong:</strong> Using same resume for all applications</p>
                  <p className="text-green-800 text-sm"><strong>Right:</strong> Customizing resume to highlight most relevant transferable skills for each role</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">❌ Underselling Achievements</h3>
                  <p className="text-red-800 text-sm mb-2"><strong>Wrong:</strong> "Managed classroom of 25 students"</p>
                  <p className="text-green-800 text-sm"><strong>Right:</strong> "Led learning experience design for 25+ diverse learners, implementing data-driven curriculum adjustments that improved engagement by 40%"</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">The 90-Day Transition Plan</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Days 1-30: Foundation</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div>• Research target industry and roles</div>
                  <div>• Identify skill gaps and create learning plan</div>
                  <div>• Start networking and informational interviews</div>
                  <div>• Begin relevant online courses or certifications</div>
                  <div>• Draft initial transition resume</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">Days 31-60: Building</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div>• Complete relevant projects or portfolio pieces</div>
                  <div>• Attend industry events and meetups</div>
                  <div>• Optimize LinkedIn for target industry</div>
                  <div>• Seek mentorship from industry professionals</div>
                  <div>• Refine resume based on feedback</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-600">Days 61-90: Executing</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div>• Begin targeted job applications</div>
                  <div>• Leverage network for referrals</div>
                  <div>• Practice industry-specific interview skills</div>
                  <div>• Continue learning and staying current</div>
                  <div>• Track and iterate on approach</div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Ready to Make Your Career Change?</h2>
                <p className="text-blue-800 mb-6">
                  Use our transition-specific templates and examples from successful career changers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/templates">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Browse Transition Templates
                    </Button>
                  </Link>
                  <Link to="/resumes">
                    <Button variant="outline" size="lg">
                      See Career Change Examples
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

export default CareerTransitionGuide;