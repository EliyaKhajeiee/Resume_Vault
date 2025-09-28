import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowLeft, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const TechResumeGuide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-4xl mx-auto px-4">
          <Link to="/guides" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guides
          </Link>

          <Badge className="mb-4">Resume Writing</Badge>
          <h1 className="text-4xl font-bold text-black mb-4">
            The Complete Guide to Writing a Tech Resume
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Everything you need to know about crafting a resume that gets you hired at top tech companies.
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-8">
            <User className="w-4 h-4 mr-2" />
            <span className="mr-4">Nathan Lee</span>
            <Clock className="w-4 h-4 mr-2" />
            <span>15 min read</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Tech</Badge>
            <Badge variant="outline">Resume</Badge>
            <Badge variant="outline">FAANG</Badge>
          </div>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">

          {/* Table of Contents */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li><a href="#structure" className="text-blue-600 hover:underline">1. Resume Structure for Tech Roles</a></li>
                <li><a href="#technical-skills" className="text-blue-600 hover:underline">2. Technical Skills Section</a></li>
                <li><a href="#experience" className="text-blue-600 hover:underline">3. Writing Compelling Experience Bullets</a></li>
                <li><a href="#projects" className="text-blue-600 hover:underline">4. Projects That Stand Out</a></li>
                <li><a href="#education" className="text-blue-600 hover:underline">5. Education and Certifications</a></li>
                <li><a href="#ats-optimization" className="text-blue-600 hover:underline">6. ATS Optimization</a></li>
                <li><a href="#common-mistakes" className="text-blue-600 hover:underline">7. Common Mistakes to Avoid</a></li>
              </ul>
            </CardContent>
          </Card>

          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Landing a job at Google, Meta, Amazon, or other top tech companies requires more than just technical skills.
              Your resume is your first impression, and in the competitive tech industry, it needs to be exceptional.
            </p>

            <Card className="bg-green-50 border-green-200 mb-8">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">What You'll Learn</h3>
                    <ul className="text-green-800 space-y-1">
                      <li>• How to structure your resume for maximum impact</li>
                      <li>• Technical skills presentation that gets noticed</li>
                      <li>• Writing experience bullets that showcase your value</li>
                      <li>• ATS optimization techniques that actually work</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 1: Resume Structure */}
          <section id="structure" className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">1. Resume Structure for Tech Roles</h2>

            <p className="text-gray-700 mb-6">
              Your tech resume should follow this proven structure that recruiters expect:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">Optimal Resume Order:</h3>
              <ol className="space-y-2">
                <li><strong>1. Header</strong> - Name, phone, email, LinkedIn, GitHub, portfolio (if applicable)</li>
                <li><strong>2. Technical Skills</strong> - Programming languages, frameworks, tools, databases</li>
                <li><strong>3. Experience</strong> - Professional work experience with quantified achievements</li>
                <li><strong>4. Projects</strong> - 2-3 impressive technical projects</li>
                <li><strong>5. Education</strong> - Degree, relevant coursework, GPA (if 3.5+)</li>
                <li><strong>6. Optional Sections</strong> - Certifications, publications, awards</li>
              </ol>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <Lightbulb className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Pro Tip</h3>
                    <p className="text-yellow-800">
                      Put technical skills near the top. Tech recruiters and hiring managers scan for relevant
                      technologies first, then dive into your experience if you pass the initial screen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Technical Skills */}
          <section id="technical-skills" className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">2. Technical Skills Section</h2>

            <p className="text-gray-700 mb-6">
              Your technical skills section is critical. Here's how to make it effective:
            </p>

            <h3 className="text-xl font-semibold mb-4">Categorize Your Skills</h3>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="font-medium mb-3">Example Structure:</p>
              <div className="space-y-2 text-sm">
                <p><strong>Languages:</strong> Python, JavaScript, Java, TypeScript, SQL</p>
                <p><strong>Frontend:</strong> React, Vue.js, HTML5, CSS3, Tailwind CSS</p>
                <p><strong>Backend:</strong> Node.js, Express, Django, Spring Boot, REST APIs</p>
                <p><strong>Databases:</strong> PostgreSQL, MongoDB, Redis, MySQL</p>
                <p><strong>Cloud/DevOps:</strong> AWS, Docker, Kubernetes, CI/CD, Git</p>
                <p><strong>Tools:</strong> VS Code, Jira, Figma, Postman</p>
              </div>
            </div>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Common Mistake</h3>
                    <p className="text-red-800">
                      Don't list every technology you've ever touched. Focus on skills you're comfortable
                      discussing in an interview and have real experience with.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Experience */}
          <section id="experience" className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">3. Writing Compelling Experience Bullets</h2>

            <p className="text-gray-700 mb-6">
              Each bullet point should follow the STAR method: Situation, Task, Action, Result.
            </p>

            <h3 className="text-xl font-semibold mb-4">The Formula</h3>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <p className="font-medium mb-3">Action Verb + Technical Detail + Business Impact + Quantified Result</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">❌ Weak Example:</p>
                  <p className="text-sm">Worked on the backend of the application</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">✅ Strong Example:</p>
                  <p className="text-sm">Architected and implemented REST API using Node.js and PostgreSQL, reducing data retrieval time by 40% and supporting 10,000+ concurrent users</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Power Words for Tech Resumes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Development</h4>
                <ul className="text-xs space-y-1">
                  <li>Architected</li>
                  <li>Engineered</li>
                  <li>Implemented</li>
                  <li>Developed</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Optimization</h4>
                <ul className="text-xs space-y-1">
                  <li>Optimized</li>
                  <li>Streamlined</li>
                  <li>Enhanced</li>
                  <li>Improved</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Leadership</h4>
                <ul className="text-xs space-y-1">
                  <li>Led</li>
                  <li>Collaborated</li>
                  <li>Mentored</li>
                  <li>Coordinated</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Problem Solving</h4>
                <ul className="text-xs space-y-1">
                  <li>Debugged</li>
                  <li>Resolved</li>
                  <li>Investigated</li>
                  <li>Troubleshot</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Projects */}
          <section id="projects" className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">4. Projects That Stand Out</h2>

            <p className="text-gray-700 mb-6">
              Your projects section should showcase your ability to build complete applications and solve real problems.
            </p>

            <h3 className="text-xl font-semibold mb-4">Project Description Template</h3>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="font-medium mb-3">For each project, include:</p>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Project Name</strong> with link to GitHub/live demo</li>
                <li>• <strong>One-line description</strong> of what it does and why it's useful</li>
                <li>• <strong>Technologies used</strong> (be specific)</li>
                <li>• <strong>Key achievements</strong> or interesting technical challenges solved</li>
                <li>• <strong>Quantified results</strong> where possible (users, performance, etc.)</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-medium mb-3">Example Project Entry:</h4>
              <div className="text-sm">
                <p className="font-medium">TaskFlow - Full-Stack Project Management App | <span className="text-blue-600">GitHub • Live Demo</span></p>
                <p className="mt-2">Built a collaborative project management platform using React, Node.js, and PostgreSQL with real-time updates via Socket.io</p>
                <p className="mt-1">• Implemented JWT authentication and role-based access control for 3 user types</p>
                <p className="mt-1">• Designed responsive UI with drag-and-drop functionality, reducing task management time by 30%</p>
                <p className="mt-1">• Deployed on AWS with Docker, supporting 500+ concurrent users with 99.9% uptime</p>
              </div>
            </div>
          </section>

          {/* Section 5: ATS Optimization */}
          <section id="ats-optimization" className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">6. ATS Optimization</h2>

            <p className="text-gray-700 mb-6">
              Most tech companies use Applicant Tracking Systems (ATS) to filter resumes. Here's how to pass them:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-green-900">✅ ATS-Friendly Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-green-800">
                    <li>• Use standard section headings</li>
                    <li>• Include exact keywords from job description</li>
                    <li>• Use simple, clean formatting</li>
                    <li>• Save as .docx or .pdf</li>
                    <li>• Use standard fonts (Arial, Calibri)</li>
                    <li>• Avoid images, graphs, or tables</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-lg text-red-900">❌ ATS Killers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2 text-red-800">
                    <li>• Creative or unusual layouts</li>
                    <li>• Headers/footers with important info</li>
                    <li>• Multiple columns</li>
                    <li>• Special characters or symbols</li>
                    <li>• Acronyms without full terms</li>
                    <li>• Fancy fonts or formatting</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 6: Common Mistakes */}
          <section id="common-mistakes" className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">7. Common Mistakes to Avoid</h2>

            <div className="space-y-6">
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">1. Generic, One-Size-Fits-All Resume</h3>
                  <p className="text-red-800 text-sm">
                    Tailor your resume for each application. Highlight relevant technologies and experiences that match the job description.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">2. Focusing on Responsibilities Instead of Achievements</h3>
                  <p className="text-red-800 text-sm">
                    Don't just list what you did. Show the impact you made with quantified results.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-red-900 mb-2">3. Technical Jargon Without Context</h3>
                  <p className="text-red-800 text-sm">
                    While technical details are important, explain the business value and user impact of your work.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mb-12">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Ready to Build Your Tech Resume?</h2>
                <p className="text-blue-800 mb-6">
                  Use our templates and tools to create a resume that gets you interviews at top tech companies.
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

export default TechResumeGuide;