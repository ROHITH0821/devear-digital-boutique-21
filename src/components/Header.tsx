import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, Heart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useUser } from "@/contexts/UserContext";
import CartDrawer from "@/components/Cart/CartDrawer";
import CartPreview from "@/components/Cart/CartPreview";
import SearchAutocomplete from "./Search/SearchAutocomplete";
import AuthDialog from "./Auth/AuthDialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const { getCartCount, toggleCart } = useCart();
  const { getWishlistCount } = useWishlist();
  const { state: userState, logout } = useUser();
  
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold tracking-tight">DEVEAR</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors">
                  Categories
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border border-border">
                  <DropdownMenuItem asChild>
                    <Link to="/shop?category=Men">Men's Fashion</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/shop?category=Women">Women's Fashion</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/shop?category=Accessories">Accessories</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchAutocomplete placeholder="Search products..." />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              {/* User Account */}
              {userState.profile.isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      <User className="h-4 w-4 mr-2" />
                      {userState.profile.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleAuthClick('signin')}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => handleAuthClick('signup')}>
                    Sign Up
                  </Button>
                </div>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                className="relative" 
                onClick={toggleCart}
                onMouseEnter={() => setShowCartPreview(true)}
                onMouseLeave={() => setShowCartPreview(false)}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-6 space-y-4">
              <div className="md:hidden mb-4">
                <SearchAutocomplete placeholder="Search products..." />
              </div>
              <Link
                to="/"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/shop?category=Men"
                className="block py-2 text-foreground hover:text-primary transition-colors pl-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Men's Fashion
              </Link>
              <Link
                to="/shop?category=Women"
                className="block py-2 text-foreground hover:text-primary transition-colors pl-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Women's Fashion
              </Link>
              <Link
                to="/shop?category=Accessories"
                className="block py-2 text-foreground hover:text-primary transition-colors pl-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>
              <Link
                to="/wishlist"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Favorites ({wishlistCount})
              </Link>
              {!userState.profile.isLoggedIn && (
                <div className="space-y-2 pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleAuthClick('signin');
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleAuthClick('signup');
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <CartDrawer />
        <div className="relative">
          <CartPreview isOpen={showCartPreview} onClose={() => setShowCartPreview(false)} />
        </div>
      </header>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultMode={authMode}
      />
    </>
  );
};

export default Header;