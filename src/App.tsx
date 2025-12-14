import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageViewTracker } from "@/components/PageViewTracker";
import Index from "./pages/Index";
import Resumes from "./pages/Resumes";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Templates from "./pages/Templates";
import Guides from "./pages/Guides";
import TechResumeGuide from "./pages/guides/TechResumeGuide";
import QuantifyImpactGuide from "./pages/guides/QuantifyImpactGuide";
import ProductManagerGuide from "./pages/guides/ProductManagerGuide";
import ConsultingGuide from "./pages/guides/ConsultingGuide";
import ATSGuide from "./pages/guides/ATSGuide";
import CareerTransitionGuide from "./pages/guides/CareerTransitionGuide";
import InterviewQuestions from "./pages/InterviewQuestions";
import JobBoards from "./pages/JobBoards";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/auth/AuthCallback";
import ResetPassword from "./pages/auth/ResetPassword";
import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import Settings from "./pages/Settings";
import Luna from "./pages/Luna";
import FieldA from "./pages/FieldA";
import FieldB from "./pages/FieldB";
import FieldC from "./pages/FieldC";
import FieldD from "./pages/FieldD";
import FieldE from "./pages/FieldE";
import FieldF from "./pages/FieldF";
import FieldG from "./pages/FieldG";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageViewTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/tech-resume" element={<TechResumeGuide />} />
          <Route path="/guides/quantify-impact" element={<QuantifyImpactGuide />} />
          <Route path="/guides/product-manager" element={<ProductManagerGuide />} />
          <Route path="/guides/consulting" element={<ConsultingGuide />} />
          <Route path="/guides/ats-optimization" element={<ATSGuide />} />
          <Route path="/guides/career-transition" element={<CareerTransitionGuide />} />
          <Route path="/interview-questions" element={<InterviewQuestions />} />
          <Route path="/job-boards" element={<JobBoards />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/purchase/success" element={<PurchaseSuccess />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/luna" element={<Luna />} />
          <Route path="/a" element={<FieldA />} />
          <Route path="/b" element={<FieldB />} />
          <Route path="/c" element={<FieldC />} />
          <Route path="/d" element={<FieldD />} />
          <Route path="/e" element={<FieldE />} />
          <Route path="/f" element={<FieldF />} />
          <Route path="/g" element={<FieldG />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;