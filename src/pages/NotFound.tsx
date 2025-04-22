
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-secondary-foreground mb-4">
          Oops! Page not found
        </p>
        <button
          className="text-primary bg-secondary px-4 py-2 rounded hover:bg-primary hover:text-background transition-all font-semibold"
          onClick={() => navigate("/")}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
export default NotFound;
