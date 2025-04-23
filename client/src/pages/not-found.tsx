import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-950">
      <Card className="w-full max-w-md mx-4 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">404 Page Not Found</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              The page you are looking for might have been removed, had its name changed,
              or is temporarily unavailable.
            </p>
          </div>
          
          <div className="flex justify-center mt-6">
            <Link href="/">
              <Button className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
