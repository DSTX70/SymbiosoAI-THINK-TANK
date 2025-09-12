import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Lightbulb, ArrowRight, CheckCircle, Star, LogIn } from "lucide-react";
import { Link } from "wouter";
import symbiosoLogo from "@assets/SymbiosoAi Horizontal Logo with Tag_1756950480614.png";
import { AuthButton } from "@/components/AuthButton";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <img 
                src={symbiosoLogo} 
                alt="SymbiosoAi" 
                className="h-64 md:h-96 w-auto" 
                data-testid="logo-hero"
              />
            </div>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
              Enterprise-grade collaborative intelligence platform that leverages multiple AI agents to conduct structured debates and generate consensus-driven insights.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link href="/simple">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" data-testid="button-try-demo">
                Try Demo
              </Button>
            </Link>
          </div>
          
          {/* Authentication Section */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center">
                Quick Demo Access:
              </p>
              <AuthButton />
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>Enterprise-grade</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Multi-agent AI</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Real-time collaboration</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle data-testid="feature-ai-title">Multi-Agent AI Debates</CardTitle>
              <CardDescription>
                Four specialized AI agents (Analyst, Critic, Synthesizer, Domain Expert) conduct structured debates to reach nuanced conclusions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  18 specialized domain experts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Configurable debate rounds (1-10)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Advanced reasoning frameworks
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle data-testid="feature-collaboration-title">Team Collaboration</CardTitle>
              <CardDescription>
                Real-time workspace sharing, role-based access control, and session management for seamless team collaboration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Multi-workspace support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Real-time synchronization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Permission management
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle data-testid="feature-enterprise-title">Enterprise Features</CardTitle>
              <CardDescription>
                Interactive fact-checking, visual journey mapping, template management, and comprehensive analytics for enterprise needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Interactive fact-checking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Visual journey timeline
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Template library system
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Three Modes */}
        <div className="text-center space-y-8 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white" data-testid="heading-modes">
            Three Progressive Complexity Levels
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the right level of analysis for your needs, from quick insights to comprehensive enterprise analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link href="/simple">
            <Card className="cursor-pointer hover:shadow-xl transition-shadow border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400" data-testid="mode-simple-title">Simple Mode</CardTitle>
                <CardDescription>
                  Quick analysis for immediate insights and rapid decision-making.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Fast 3-agent debate</li>
                  <li>• Basic consensus building</li>
                  <li>• Essential dissenting views</li>
                  <li>• Perfect for quick decisions</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/guided">
            <Card className="cursor-pointer hover:shadow-xl transition-shadow border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400" data-testid="mode-guided-title">Guided Mode</CardTitle>
                <CardDescription>
                  Intermediate configuration options with enhanced analysis capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 4-agent structured debate</li>
                  <li>• Configurable debate rounds</li>
                  <li>• Citation management</li>
                  <li>• Fact-checking integration</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/expert">
            <Card className="cursor-pointer hover:shadow-xl transition-shadow border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-purple-600 dark:text-purple-400" data-testid="mode-expert-title">Expert Mode</CardTitle>
                <CardDescription>
                  Comprehensive enterprise features with full customization and team collaboration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 5-agent enterprise analysis</li>
                  <li>• Domain expert selection</li>
                  <li>• Template library access</li>
                  <li>• Workspace management</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" data-testid="heading-cta">
            Ready to Transform Your Decision-Making?
          </h2>
          <p className="text-lg mb-6 text-blue-100">
            Join leading organizations using SymbiosoAi ThinkTank for strategic analysis and collaborative intelligence.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 h-auto bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-start-free"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}