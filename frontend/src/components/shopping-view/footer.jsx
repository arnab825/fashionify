import { Link } from "react-router-dom";
import { HousePlug, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

function ShoppingFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/shop/home" className="flex items-center gap-2">
              <HousePlug className="h-6 w-6" />
              <span className="font-bold text-xl font-heading">Fashionify</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your one-stop destination for premium fashion and accessories. Dress better, feel better.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-heading">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop/listing?category=men" className="hover:text-primary transition-colors">Men's Clothing</Link></li>
              <li><Link to="/shop/listing?category=women" className="hover:text-primary transition-colors">Women's Clothing</Link></li>
              <li><Link to="/shop/listing?category=kids" className="hover:text-primary transition-colors">Kids</Link></li>
              <li><Link to="/shop/listing?category=accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-heading">Help</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Customer Service</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Shipping Information</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 font-heading">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Fashionify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
