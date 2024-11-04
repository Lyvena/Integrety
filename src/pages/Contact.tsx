import { Chat } from "@/components/Chat";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Navigation />

          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions or need support? We're here to help!
            </p>

            <Card className="p-8 text-center mb-8">
              <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">Email Us</h2>
              <p className="text-muted-foreground mb-4">
                Send us an email and we'll get back to you as soon as possible.
              </p>
              <a href="mailto:info@lyvena.xyz" className="inline-block">
                <Button size="lg" className="rounded-full">
                  info@lyvena.xyz
                </Button>
              </a>
            </Card>

            <Card className="p-8 text-center mb-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-2">
                Chat with AI Assistant
              </h2>
              <p className="text-muted-foreground mb-4">
                Get instant answers to your questions about programming and AI
                development.
              </p>
              <Chat className="mt-6" />
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
