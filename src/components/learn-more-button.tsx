"use client";

import { Button } from "@/components/ui/button";

export function LearnMoreButton() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Button size="lg" variant="outline" onClick={scrollToFeatures}>
      Learn More
    </Button>
  );
}