import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowLeft, Bot, Search, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const ATSGuide = () => {
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
            ATS Optimization: Getting Past the Robots
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Master the art of ATS optimization without sacrificing readability and impact.
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-8">
            <User className="w-4 h-4 mr-2" />
            <span className="mr-4">Nathan Lee</span>
            <Clock className="w-4 h-4 mr-2" />
            <span>7 min read</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">ATS</Badge>
            <Badge variant="outline">Keywords</Badge>
            <Badge variant="outline">Optimization</Badge>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">What is an ATS and Why Should You Care?</h2>

            <p className="text-gray-700 mb-6">
              Applicant Tracking Systems (ATS) are software applications that help companies manage their hiring process.
              Over 75% of large companies and 95% of Fortune 500 companies use ATS to filter resumes before human eyes see them.
            </p>

            <Card className="bg-red-50 border-red-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <Bot className="w-8 h-8 text-red-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">The Harsh Reality</h3>
                    <p className="text-red-800 text-sm">
                      Studies show that 75% of qualified candidates are rejected by ATS systems before a human recruiter
                      ever sees their resume. Don't let robots kill your chances.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">How ATS Systems Work:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" /><span>Parse and extract information from your resume</span></div>
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" /><span>Match keywords against job description requirements</span></div>
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" /><span>Score resumes based on relevance and keyword density</span></div>
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" /><span>Rank candidates and filter out low-scoring resumes</span></div>
                <div className="flex items-center"><CheckCircle className="w-4 h-4 text-green-600 mr-2" /><span>Only top-scoring resumes reach human recruiters</span></div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">The ATS-Friendly Resume Checklist</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-900">✅ ATS-Friendly Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-green-800">
                    <li>• Use standard section headings (Experience, Education, Skills)</li>
                    <li>• Include exact keywords from job description</li>
                    <li>• Use simple, clean formatting</li>
                    <li>• Save as .docx or PDF (check job posting)</li>
                    <li>• Use standard fonts (Arial, Calibri, Times New Roman)</li>
                    <li>• Avoid images, graphs, charts, or tables</li>
                    <li>• Use bullet points instead of paragraphs</li>
                    <li>• Include both acronyms and full terms</li>
                    <li>• Use chronological or hybrid format</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-900">❌ ATS Killers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-red-800">
                    <li>• Creative layouts with multiple columns</li>
                    <li>• Headers/footers with contact information</li>
                    <li>• Text boxes, images, or graphics</li>
                    <li>• Fancy fonts or excessive formatting</li>
                    <li>• Special characters (★, ●, ►, etc.)</li>
                    <li>• Tables for organizing content</li>
                    <li>• Functional or creative resume formats</li>
                    <li>• PDF files (unless specifically requested)</li>
                    <li>• Non-standard section names</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Keyword Optimization Strategy</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 1: Extract Keywords from Job Descriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Hard Skills Keywords:</h4>
                      <p>Programming languages, software, certifications, tools, methodologies</p>
                      <div className="bg-gray-50 p-3 rounded text-xs">
                        Example: Python, React, AWS, Agile, Scrum Master Certification, Tableau, SQL
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Soft Skills Keywords:</h4>
                      <p>Leadership qualities, communication skills, industry buzzwords</p>
                      <div className="bg-gray-50 p-3 rounded text-xs">
                        Example: Cross-functional collaboration, stakeholder management, data-driven decision making
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Industry-Specific Terms:</h4>
                      <p>Jargon, regulations, standards, common processes</p>
                      <div className="bg-gray-50 p-3 rounded text-xs">
                        Example: GDPR compliance, SOX controls, FDA regulations, DevOps pipeline
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 2: Strategic Keyword Placement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div><strong>Skills Section:</strong> Most important keywords should appear here first</div>
                    <div><strong>Experience Bullets:</strong> Naturally integrate keywords into achievement descriptions</div>
                    <div><strong>Summary/Objective:</strong> Include 3-5 top keywords that define your expertise</div>
                    <div><strong>Education/Certifications:</strong> Include exact certification names and acronyms</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Before & After: ATS Optimization Examples</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Software Engineer Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2">❌ ATS-Unfriendly Version:</p>
                      <div className="bg-red-50 p-4 rounded text-sm">
                        "Built awesome web apps using modern frameworks and cloud tech. Increased performance significantly."
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-2">✅ ATS-Optimized Version:</p>
                      <div className="bg-green-50 p-4 rounded text-sm">
                        "Developed responsive web applications using React.js, Node.js, and AWS cloud services. Optimized application performance by 40% through code refactoring and database optimization using PostgreSQL."
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Marketing Manager Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2">❌ ATS-Unfriendly Version:</p>
                      <div className="bg-red-50 p-4 rounded text-sm">
                        "Managed various marketing campaigns and improved brand awareness across multiple channels."
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-2">✅ ATS-Optimized Version:</p>
                      <div className="bg-green-50 p-4 rounded text-sm">
                        "Executed integrated digital marketing campaigns across Google Ads, Facebook Ads, and email marketing platforms. Increased brand awareness by 35% and generated 500+ qualified leads using HubSpot CRM and marketing automation."
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Top ATS Systems and Their Quirks</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular ATS Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Workday:</strong> Used by 40% of Fortune 500</li>
                    <li>• <strong>Taleo (Oracle):</strong> Common in large enterprises</li>
                    <li>• <strong>iCIMS:</strong> Popular with mid-size companies</li>
                    <li>• <strong>Greenhouse:</strong> Tech startup favorite</li>
                    <li>• <strong>Lever:</strong> Growing in popularity</li>
                    <li>• <strong>BambooHR:</strong> Small to medium businesses</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Universal ATS Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li>• Use both "MBA" and "Master of Business Administration"</li>
                    <li>• Include location information (City, State)</li>
                    <li>• Use standard date formats (MM/YYYY)</li>
                    <li>• Spell out numbers less than 10</li>
                    <li>• Include relevant synonyms for key skills</li>
                    <li>• Test your resume with free ATS scanners</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Free ATS Testing Tools</h2>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Test Your Resume Before Applying:</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div>• <strong>Jobscan:</strong> Compare your resume against specific job descriptions</div>
                  <div>• <strong>ResumeWorded:</strong> Free ATS scanner with optimization suggestions</div>
                  <div>• <strong>SkillSyncer:</strong> Keyword matching and ATS-friendly formatting tips</div>
                  <div>• <strong>TopResume:</strong> Free basic ATS scan and review</div>
                  <div>• <strong>ZipJob:</strong> ATS compatibility checker</div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Advanced ATS Strategies</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">The "White Text" Myth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-800 mb-2">
                    <strong>Don't do this:</strong> Adding white text with keywords is detectable by modern ATS and considered fraudulent.
                  </p>
                  <p className="text-sm text-green-800">
                    <strong>Do this instead:</strong> Naturally incorporate keywords throughout your resume content.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keyword Density Sweet Spot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div>• <strong>Optimal density:</strong> 2-3% keyword density (not stuffing)</div>
                    <div>• <strong>Natural integration:</strong> Keywords should read naturally in context</div>
                    <div>• <strong>Variation:</strong> Use synonyms and related terms</div>
                    <div>• <strong>Focus on relevance:</strong> Quality over quantity</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Beat the ATS and Get Noticed</h2>
                <p className="text-blue-800 mb-6">
                  Use our ATS-optimized templates designed to pass through any screening system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/templates">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Browse ATS-Friendly Templates
                    </Button>
                  </Link>
                  <Link to="/resumes">
                    <Button variant="outline" size="lg">
                      See ATS Examples
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

export default ATSGuide;