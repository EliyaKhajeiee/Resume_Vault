import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<"signin" | "signup">("signin");
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  
  // Admin email - replace with your actual email
  const ADMIN_EMAIL = "your-admin-email@example.com"; // UPDATE THIS WITH YOUR EMAIL
  const isAdmin = user?.email === ADMIN_EMAIL;

  const navigation = [
    { name: "Browse Resumes", href: "/resumes" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success("Successfully signed out!");
    } else {
      toast.error("Failed to sign out");
    }
  };

  const openAuthDialog = (tab: "signin" | "signup") => {
    setAuthDialogTab(tab);
    setAuthDialogOpen(true);
  };
  return (
    <>
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2" onClick={handleNavClick}>
          <div className="font-bold text-2xl text-black">Resume Proof</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive(item.href) ? "text-blue-600" : "text-gray-700"
              }`}
              onClick={handleNavClick}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Section (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
          {loading ? (
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => openAuthDialog("signin")}>
                Log in
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => openAuthDialog("signup")}>
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive(item.href) ? "text-blue-600" : "text-gray-700"
                  }`}
                  onClick={handleNavClick}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Auth Buttons */}
            <div className="flex space-x-2 pt-4 border-t">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1" onClick={handleSignOut}>
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openAuthDialog("signin")}>
                    Log in
                  </Button>
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => openAuthDialog("signup")}>
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </header>

      <AuthDialog 
        open={authDialogOpen} 
        onOpenChange={setAuthDialogOpen}
        defaultTab={authDialogTab}
      />
    </>
  );
};

export default Header;