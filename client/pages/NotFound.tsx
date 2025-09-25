import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center glass rounded-2xl p-10">
        <h1 className="text-4xl font-orbitron mb-2">404</h1>
        <p className="text-white/70 mb-4">Oops! Page not found</p>
        <a href="/" className="text-white underline underline-offset-4">Return to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
