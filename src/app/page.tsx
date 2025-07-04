import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Film, Users, Heart, AlertCircle, Sparkles, Clock, Shield } from "lucide-react";
import { LearnMoreButton } from "@/components/learn-more-button";

export const metadata: Metadata = {
  title: "MovieNight - Collaborative Movie Discovery",
  description: "Create shared spaces to build watchlists and track favorites with friends and family",
  openGraph: {
    title: "MovieNight - Collaborative Movie Discovery",
    description: "Create shared spaces to build watchlists and track favorites with friends and family",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieNight - Collaborative Movie Discovery",
    description: "Create shared spaces to build watchlists and track favorites with friends and family",
  },
};

const features = [
  {
    icon: Users,
    title: "Shared Spaces",
    description: "Create collaborative movie collections with friends and family",
    badge: "Collaborative",
  },
  {
    icon: Film,
    title: "Smart Watchlists",
    description: "Build and manage watchlists together in real-time",
    badge: "Real-time",
  },
  {
    icon: Heart,
    title: "Track Favorites",
    description: "Keep track of movies you've loved and share recommendations",
    badge: "Personal",
  },
] as const;

const benefits = [
  {
    id: "discover",
    icon: Sparkles,
    text: "Discover new movies based on group preferences",
  },
  {
    id: "save-time",
    icon: Clock,
    text: "Save time deciding what to watch",
  },
  {
    id: "family-friendly",
    icon: Shield,
    text: "Family-friendly content filtering",
  },
] as const;

interface FeatureCardProps {
  icon: typeof Users;
  title: string;
  description: string;
  badge?: string;
}

function FeatureCard({ icon: Icon, title, description, badge }: FeatureCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-10 w-10 text-primary" />
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

interface HeroSectionProps {
  isAuthenticated: boolean;
}

function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
        <Badge variant="outline" className="px-4 py-1">
          <Sparkles className="mr-2 h-3 w-3" />
          Collaborative Movie Discovery
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          MovieNight
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
          Discover movies together. Create shared spaces, build watchlists, and track your favorite films with the people you care about.
        </p>
        
        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4">
            <SignInButton mode="modal">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </SignInButton>
            <LearnMoreButton />
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="container mx-auto px-4 py-16 bg-muted/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Everything you need for movie nights
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          MovieNight brings your movie-watching experience together in one collaborative platform
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            badge={feature.badge}
          />
        ))}
      </div>
      
      <Separator className="my-12" />
      
      <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="flex items-center gap-3 text-sm">
            <benefit.icon className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">{benefit.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ErrorDisplay() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          We&apos;re having trouble loading this page. Please try refreshing or come back later.
        </AlertDescription>
      </Alert>
    </main>
  );
}

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection isAuthenticated={false} />
      <FeaturesSection />
    </main>
  );
}