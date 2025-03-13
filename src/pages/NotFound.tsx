
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-7xl font-bold mb-6 text-primary animate-scale-in">404</h1>
          <p className="text-xl text-muted-foreground mb-8 animate-slide-in">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="animate-slide-in" 
            style={{ animationDelay: '150ms' }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
