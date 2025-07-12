"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import {
  Building2,
  MessageSquare,
  Users,
  Shield,
  Database,
  Zap,
  Rocket,
  ArrowRightCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">VPBank</h1>
              <p className="text-sm text-gray-500">Chatbot Reviewer Platform</p>
            </div>
          </div>
          <Button onClick={() => router.push("/login")} size="lg">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl font-bold leading-tight mb-4 text-gray-900">
            Simplify and Accelerate
            <span className="text-blue-600"> Customer Conversations</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Manage Facebook chatbot interactions with real-time messaging,
            segment-based assignment, and knowledge-driven responses.
          </p>
          <Button
            onClick={() => router.push("/login")}
            size="lg"
            className="text-white bg-blue-600 hover:bg-blue-700"
          >
            Get Started
          </Button>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Powerful Features, Seamless Experience
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Chat",
                desc: "Communicate instantly through a modern messenger-style interface.",
                icon: MessageSquare,
                color: "text-blue-600",
              },
              {
                title: "Role-based Access",
                desc: "Securely assign permissions based on user roles and responsibilities.",
                icon: Shield,
                color: "text-green-600",
              },
              {
                title: "Segment Management",
                desc: "Assign reviewers to specific customer types for efficient handling.",
                icon: Users,
                color: "text-purple-600",
              },
              {
                title: "Knowledge Base",
                desc: "Leverage pre-approved replies to ensure consistent communication.",
                icon: Database,
                color: "text-orange-600",
              },
              {
                title: "Smart Suggestions",
                desc: "Quick replies with template expansion using smart variables.",
                icon: Zap,
                color: "text-yellow-600",
              },
              {
                title: "Integrated Workflow",
                desc: "Assign, review, tag, and close customer threads with ease.",
                icon: Rocket,
                color: "text-indigo-600",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full shadow-sm hover:shadow-md transition">
                  <CardHeader className="text-center">
                    <f.icon className={`h-10 w-10 mx-auto mb-2 ${f.color}`} />
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {f.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-blue-100">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                step: "1. Connect Fanpage",
                desc: "Authenticate with Facebook and choose the page you want to manage.",
              },
              {
                step: "2. Receive & Assign",
                desc: "Customer messages arrive in real-time. Reviewers handle threads based on assigned segments.",
              },
              {
                step: "3. Reply & Resolve",
                desc: "Respond using live chat or templates, leave internal notes, and update review status.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition"
              >
                <h4 className="text-lg font-semibold text-blue-600 mb-2">
                  {item.step}
                </h4>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Enhance Customer Experience?
          </h2>
          <p className="mb-6 text-lg">
            Get started with VPBank Chatbot Reviewer today.
          </p>
          <Button
            onClick={() => router.push("/login")}
            size="lg"
            className="bg-white text-blue-700 hover:bg-blue-100"
          >
            Start Now <ArrowRightCircle className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
