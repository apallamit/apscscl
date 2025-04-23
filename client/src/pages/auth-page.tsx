import { useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "test@apscscl.com",
      password: "testPassword123!",
      remember: false,
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-purple-600 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Login Form */}
        <Card className="w-full glassmorphism dark:bg-opacity-10 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardContent className="pt-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">APSCSCL Trip Bookings</h1>
              <p className="text-white/80">Admin Login</p>
            </div>

            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@example.com"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={loginForm.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-white data-[state=checked]:text-primary-600"
                          />
                        </FormControl>
                        <FormLabel className="text-sm text-white">Remember me</FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button variant="link" className="text-white hover:text-primary-200 p-0">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-primary hover:bg-primary-50"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </Button>

                <div className="text-center text-sm text-white/70 mt-4">
                  <span>Test User: test@apscscl.com / testPassword123!</span>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Hero section */}
        <div className="hidden md:flex flex-col justify-center text-white">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Futuristic Admin Dashboard</h2>
            <p className="text-xl text-white/80">
              A powerful management system for APSCSCL Trip Bookings with advanced features and analytics.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <span className="text-white">✓</span>
                </div>
                <p>Real-time tracking and monitoring</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <span className="text-white">✓</span>
                </div>
                <p>Advanced reporting and analytics</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <span className="text-white">✓</span>
                </div>
                <p>Streamlined trip management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
