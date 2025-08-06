import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredPost = {
    title: "Why We Started Resume Proof: Leveling the Playing Field in a Tough Job Market",
    excerpt: "The story of how two founders decided to help students and professionals achieve their dreams through curated, proven resume examples.",
    author: "Nathan Lee & Eliya Khajeie",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    category: "Company Story",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    content: `
      The job market in 2025 has been brutal. Despite having strong technical skills and impressive academic backgrounds, we watched countless talented individuals struggle to land interviews at top companies. The problem wasn't their qualifications—it was how they presented them.

      As an Associate Product Manager at Google, Nathan saw firsthand how certain resume formats and storytelling techniques consistently led to successful hires. Meanwhile, Eliya, running a software engineering firm serving multi-million dollar enterprises, noticed that the most successful candidates all seemed to follow similar patterns in their applications.

      But here's the thing: this knowledge was locked away in private networks. The best resume examples were shared only among insiders, creating an unfair advantage for those with the right connections.

      That's when we realized we had to act. We started collecting real resume examples from successful candidates—not theoretical templates, but actual resumes that led to job offers at Google, Meta, Apple, McKinsey, Goldman Sachs, and hundreds of other top companies.

      Every resume in our database is verified and has led to an actual job offer. We believe that with the right guidance and examples, anyone can achieve their career goals, regardless of their background or connections.

      Resume Proof isn't just a product—it's our mission to democratize access to career success and help the next generation of professionals achieve their dreams.
    `
  };

  const blogPosts = [
    {
      title: "The Ultimate Guide to Product Manager Resumes",
      excerpt: "Everything you need to know about crafting a PM resume that stands out.",
      author: "Nathan Lee",
      date: "Jan 12, 2025",
      readTime: "6 min read",
      category: "Product Management",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      content: `
        Product management roles are among the most competitive in tech. After reviewing hundreds of successful PM resumes at Google, Meta, and other top companies, here's what makes the difference:

        ## The PM Resume Formula That Works

        **1. Lead with Impact Metrics**
        Your first bullet point should immediately demonstrate business impact. Instead of "Managed product roadmap," write "Led product strategy resulting in 40% increase in user engagement and $2M additional revenue."

        **2. Show Cross-Functional Leadership**
        Product managers are orchestrators. Highlight how you've worked with engineering, design, data science, and sales teams. Example: "Coordinated with 15+ engineers and 3 designers to deliver mobile app feature used by 80% of active users."

        **3. Technical Fluency Without Over-Engineering**
        You don't need to code, but you need to speak the language. Mention specific technologies, frameworks, and tools you've worked with: "Collaborated with engineering team using React, Node.js, and PostgreSQL to reduce page load time by 60%."

        **4. Customer-Centric Thinking**
        Show you understand users. Include metrics like: "Conducted 50+ user interviews and A/B tested 12 features, leading to 25% improvement in conversion rate."

        **5. Strategic Business Acumen**
        Demonstrate you think like a business owner: "Analyzed market opportunity and competitive landscape, identifying $50M addressable market for new product vertical."

        ## Common PM Resume Mistakes

        - Generic bullet points that could apply to any role
        - Focusing on features shipped rather than outcomes achieved
        - Neglecting to mention stakeholder management
        - Not quantifying user research and data analysis efforts
        - Overusing technical jargon without business context

        ## Key Sections for PM Resumes

        1. **Professional Summary**: 2-3 lines highlighting your PM experience and biggest achievements
        2. **Experience**: Focus on impact, leadership, and cross-functional collaboration
        3. **Skills**: Mix of technical, analytical, and leadership competencies
        4. **Education**: Include relevant certifications (Google PM, Scrum Master, etc.)
        5. **Additional**: Side projects, patents, or product launches

        Remember: Your resume should tell the story of someone who can identify opportunities, rally teams, and deliver results that matter to users and the business.
      `
    },
    {
      title: "Software Engineering Resume Mistakes to Avoid",
      excerpt: "Common pitfalls that prevent engineers from getting interviews.",
      author: "Eliya Khajeie",
      date: "Jan 10, 2025",
      readTime: "5 min read",
      category: "Engineering",
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      content: `
        After hiring hundreds of software engineers and reviewing thousands of resumes, I've seen the same mistakes over and over. Here are the critical errors that will kill your chances—and how to fix them.

        ## Mistake #1: Generic Technical Skills Lists

        **Wrong:** "Proficient in Python, JavaScript, React, Node.js, MongoDB, AWS"
        **Right:** "Built scalable REST APIs using Node.js and Express, serving 100K+ daily requests with 99.9% uptime"

        Don't just list technologies—show what you built with them and the impact it had.

        ## Mistake #2: No Quantified Achievements

        **Wrong:** "Improved application performance"
        **Right:** "Optimized database queries and implemented caching, reducing API response time from 500ms to 50ms (90% improvement)"

        Numbers make your achievements tangible and memorable.

        ## Mistake #3: Focusing on Duties Instead of Impact

        **Wrong:** "Responsible for maintaining legacy codebase"
        **Right:** "Refactored 15,000+ lines of legacy Java code, reducing bug reports by 40% and improving test coverage to 85%"

        Show outcomes, not just responsibilities.

        ## Mistake #4: Poor Project Descriptions

        **Wrong:** "Built a web application using React"
        **Right:** "Developed full-stack e-commerce platform using React, Node.js, and PostgreSQL. Implemented payment processing, inventory management, and analytics dashboard. Deployed on AWS with CI/CD pipeline, handling 1,000+ concurrent users."

        Paint a complete picture of your technical architecture and business impact.

        ## Mistake #5: No GitHub or Portfolio Links

        Your code is your proof. If you don't have a GitHub link or portfolio, you're missing a huge opportunity. Make sure your repositories are:
        - Well-documented with README files
        - Showcase different technologies and patterns
        - Include at least one substantial project
        - Have clean, commented code

        ## Mistake #6: Weak Technical Interview Prep

        While not strictly a resume mistake, many engineers hurt themselves by not preparing for technical interviews. Your resume gets you in the door, but you need to deliver in the interview.

        ## The Engineering Resume That Works

        **Structure:**
        1. **Contact Info & Links:** GitHub, LinkedIn, portfolio
        2. **Technical Skills:** Organized by category (Languages, Frameworks, Tools, Cloud)
        3. **Experience:** Focus on impact and technical depth
        4. **Projects:** 2-3 substantial projects with tech stack and outcomes
        5. **Education:** Degree and relevant certifications

        **Pro Tips:**
        - Use action verbs: Built, Implemented, Optimized, Designed
        - Include side projects that show passion and continuous learning
        - Mention code reviews, mentoring, and cross-team collaboration
        - Show progression in responsibility and technical complexity

        Remember: Your resume should demonstrate that you're not just a coder, but an engineer who understands systems, scale, and business impact.
      `
    },
    {
      title: "Data Science Resume Templates That Work",
      excerpt: "Proven templates and examples from successful data scientists.",
      author: "Nathan Lee",
      date: "Jan 8, 2025",
      readTime: "7 min read",
      category: "Data Science",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      content: `
        Data science roles demand a unique blend of technical skills, statistical knowledge, and business acumen. Here's how to structure your resume to showcase all three effectively.

        ## The Data Science Resume Formula

        **1. Technical Skills Section**
        Organize your skills into clear categories:
        - **Programming Languages:** Python, R, SQL, Scala, Java
        - **ML/AI Frameworks:** TensorFlow, PyTorch, Scikit-learn, Keras
        - **Data Tools:** Pandas, NumPy, Matplotlib, Seaborn, Tableau
        - **Cloud Platforms:** AWS (SageMaker, EMR), GCP (BigQuery, Vertex AI), Azure
        - **Databases:** PostgreSQL, MongoDB, Cassandra, Snowflake

        **2. Project-Focused Experience**
        Unlike traditional resumes, data science resumes should be project-heavy. For each role, include:
        - Business problem you solved
        - Data sources and size
        - Methods and algorithms used
        - Results and business impact

        **Example:**
        "Developed customer churn prediction model using Random Forest and XGBoost on 2M+ customer records. Achieved 85% accuracy, enabling proactive retention strategies that reduced churn by 23% and saved $1.2M annually."

        ## Essential Resume Sections

        **1. Professional Summary**
        2-3 lines highlighting your specialization and biggest achievements:
        "Data Scientist with 5+ years experience building ML models for fintech applications. Specialized in fraud detection and risk modeling, with deployed models processing $50M+ in transactions daily."

        **2. Technical Experience**
        Focus on methodology and impact:
        - "Built recommendation system using collaborative filtering, increasing user engagement by 35%"
        - "Implemented A/B testing framework using Python and SQL, enabling data-driven decisions across 12 product teams"
        - "Optimized deep learning pipeline, reducing model training time from 8 hours to 45 minutes"

        **3. Notable Projects**
        Include 2-3 substantial projects that show different skills:
        - End-to-end ML pipeline project
        - Data visualization or dashboarding project  
        - Research or kaggle competition

        **4. Education & Certifications**
        Include relevant coursework, especially if you're early career:
        - Machine Learning, Statistics, Linear Algebra courses
        - Certifications: AWS ML, Google Cloud ML, Coursera ML courses
        - Publications or conference presentations

        ## Common Data Science Resume Mistakes

        **Mistake #1: Too Much Technical Jargon**
        Your resume will be read by recruiters and hiring managers first. Explain your work in business terms.

        **Mistake #2: No Business Impact**
        Always connect your technical work to business outcomes. Don't just say you "built a model"—explain what problem it solved and the results.

        **Mistake #3: Outdated Skills**
        Data science moves fast. Make sure you're showing current technologies and methods.

        **Mistake #4: No Domain Expertise**
        Show that you understand the business context of your work, not just the technical aspects.

        ## Pro Tips for Data Scientists

        - Include links to your GitHub, portfolio, and any published work
        - Mention specific datasets you've worked with (size, complexity)
        - Show progression in model complexity and business impact
        - Include any teaching, mentoring, or cross-functional collaboration
        - Highlight any deployed models in production environments

        ## Sample Data Scientist Bullet Points

        - "Developed NLP sentiment analysis model processing 100K+ customer reviews daily, improving customer satisfaction scores by 15%"
        - "Led cross-functional team to build real-time fraud detection system, reducing false positives by 40% while maintaining 99.5% accuracy"
        - "Created automated feature engineering pipeline using Python and Airflow, reducing model development time by 60%"

        Remember: Your resume should tell the story of someone who can translate business problems into data solutions that drive real impact.
      `
    },
    {
      title: "How to Quantify Your Impact on Your Resume",
      excerpt: "Turn your accomplishments into compelling, measurable results.",
      author: "Eliya Khajeie",
      date: "Jan 5, 2025",
      readTime: "4 min read",
      category: "Career Tips",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop",
      content: `
        The difference between a good resume and a great resume often comes down to one thing: numbers. Quantified achievements are what make hiring managers stop and take notice. Here's how to find and present your impact metrics effectively.

        ## Why Numbers Matter

        Hiring managers scan resumes in 6-10 seconds. Numbers jump off the page and provide concrete evidence of your capabilities. Instead of saying you're "results-oriented," show the actual results.

        ## The Impact Formula

        **Before:** "Improved team productivity"
        **After:** "Implemented new workflow processes that increased team productivity by 35%, reducing project delivery time from 6 weeks to 4 weeks"

        **The Formula:** Action + Method + Result + Context

        ## Types of Metrics to Include

        **Financial Impact**
        - Revenue generated or saved
        - Budget managed
        - Cost reductions achieved
        - ROI of initiatives

        **Efficiency Metrics**
        - Time saved
        - Process improvements
        - Automation results
        - Error reduction

        **Scale Metrics**
        - Team size managed
        - Customer/user base
        - Geographic reach
        - Volume processed

        **Growth Metrics**
        - Percentage increases
        - User acquisition
        - Market share gains
        - Performance improvements

        ## Finding Your Numbers

        **Review Past Performance Reviews**
        Look for specific achievements and feedback that mentioned measurable improvements.

        **Check Analytics and Dashboards**
        - Google Analytics for web traffic
        - CRM systems for sales metrics
        - Project management tools for delivery times
        - Financial systems for budget data

        **Ask Former Colleagues**
        They might remember specific metrics or have access to data you don't.

        **Estimate When Necessary**
        If you don't have exact numbers, make reasonable estimates. Use ranges when uncertain: "Managed budget of approximately $500K-$750K"

        ## Industry-Specific Examples

        **Software Engineering:**
        - "Optimized database queries, reducing page load time from 3.2s to 0.8s (75% improvement)"
        - "Implemented CI/CD pipeline that reduced deployment time from 4 hours to 15 minutes"

        **Marketing:**
        - "Launched email campaign that generated 2,500 leads and $180K in revenue within 3 months"
        - "Increased social media engagement by 145% through content strategy overhaul"

        **Sales:**
        - "Exceeded quota by 23% for 3 consecutive quarters, generating $2.1M in new business"
        - "Managed pipeline worth $5M+ with 32% conversion rate"

        **Operations:**
        - "Streamlined inventory process, reducing overhead costs by $75K annually"
        - "Led team of 12 to achieve 99.7% on-time delivery rate"

        ## Common Quantification Mistakes

        **Mistake #1: Using Vanity Metrics**
        Focus on metrics that matter to business outcomes, not just impressive-sounding numbers.

        **Mistake #2: No Context**
        "Increased sales by 50%" means nothing without context. Over what period? Starting from what baseline?

        **Mistake #3: Inconsistent Timeframes**
        Be consistent in how you present timeframes across achievements.

        ## Action Steps

        1. **Audit your current resume** - Circle every bullet point without a number
        2. **Research your impact** - Gather data from past roles
        3. **Rewrite with metrics** - Use the Action + Method + Result + Context formula
        4. **Verify accuracy** - Make sure you can discuss any number in an interview

        Remember: Your resume is a marketing document. Numbers provide the proof that your marketing claims are real.
      `
    },
    {
      title: "McKinsey Resume Format: What Consultants Need to Know",
      excerpt: "Inside look at what top consulting firms look for in resumes.",
      author: "Nathan Lee",
      date: "Jan 3, 2025",
      readTime: "6 min read",
      category: "Consulting",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    },
    {
      title: "Resume Keywords That Actually Matter in 2025",
      excerpt: "The latest insights on ATS optimization and keyword strategy.",
      author: "Eliya Khajeie",
      date: "Dec 30, 2024",
      readTime: "5 min read",
      category: "ATS Optimization",
      image: "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"
    }
  ];

  const categories = [
    "All Posts",
    "Career Tips",
    "Engineering",
    "Product Management",
    "Data Science",
    "Consulting",
    "ATS Optimization",
    "Company Story"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-black mb-6">
            Career Insights & Resume Tips
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Expert advice, industry insights, and proven strategies to help you land your dream job.
          </p>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Featured Post */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-8">Featured Article</h2>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4">{featuredPost.category}</Badge>
                <CardTitle className="text-2xl mb-4 hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </CardTitle>
                <CardDescription className="text-gray-600 mb-6 text-base">
                  {featuredPost.excerpt}
                </CardDescription>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <User className="w-4 h-4 mr-2" />
                  <span className="mr-4">{featuredPost.author}</span>
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="mr-4">{featuredPost.date}</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest career tips and resume insights delivered to your inbox.
                </p>
                <Link to="/">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Subscribe
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-black">Latest Articles</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Most Recent
                </Button>
                <Button variant="outline" size="sm">
                  Most Popular
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="w-3 h-3 mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="mr-3">{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to build your perfect resume?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our collection of 500+ proven resume examples from top companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/resumes">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4">
                Browse Resume Examples
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="px-8 py-4">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;