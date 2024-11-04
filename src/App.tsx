import { GithubImport } from "@/components/GithubImport";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Brain,
  Code2,
  Cpu,
  Moon,
  Rocket,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_75%)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-accent/5 to-secondary/5" />
    </div>
  );
}

function GridPattern() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M100 0v100H0V0h100zM9.091 9.091h81.818v81.818H9.091V9.091z' fill='%23000' fill-opacity='0.05'/%3e%3c/svg%3e")`,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}

function FloatingIcon({
  icon: Icon,
  className,
  delay = 0,
}: { icon: any; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 4, repeat: Infinity, delay }}
      className={className}
    >
      <Icon className="w-8 h-8 text-primary/40" />
    </motion.div>
  );
}

function GradientSphere({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full bg-gradient-to-b from-primary to-accent blur-3xl opacity-20 animate-pulse ${className}`}
    />
  );
}

const features = [
  {
    icon: Sparkles,
    title: "Multiple AI Models",
    description:
      "Choose from OpenAI GPT-4, Anthropic Claude, and xAI Grok to power your applications.",
    iconClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  {
    icon: Bot,
    title: "AI Chat Assistant",
    description:
      "Get help with coding, debugging, and development using our integrated AI chat assistant.",
    iconClass: "text-accent",
    bgClass: "bg-accent/10",
  },
  {
    icon: Code2,
    title: "Code Generation",
    description:
      "Generate optimized code in multiple languages including Mojo, Rust, Python, and TypeScript.",
    iconClass: "text-secondary",
    bgClass: "bg-secondary/10",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description:
      "Deploy your applications instantly to popular platforms with just one click. No configuration needed.",
    iconClass: "text-primary",
    bgClass: "bg-primary/10",
  },
];

export default function App() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Helmet>
        <script>
          {`
            !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="QHTq7PEQwYjH52mEg02lXcxbob8O5ACF";;analytics.SNIPPET_VERSION="5.2.0";analytics.load("QHTq7PEQwYjH52mEg02lXcxbob8O5ACF");analytics.page();}}();
          `}
        </script>
      </Helmet>
      <HeroBackground />
      <GridPattern />
      <GradientSphere className="-top-40 -right-40 w-96 h-96" />
      <GradientSphere className="top-40 -left-40 w-72 h-72" />
      <GradientSphere className="bottom-40 right-20 w-64 h-64" />

      {/* Floating Icons */}
      <FloatingIcon icon={Brain} className="absolute top-20 right-[20%]" />
      <FloatingIcon
        icon={Bot}
        className="absolute top-40 left-[15%]"
        delay={1}
      />
      <FloatingIcon
        icon={Cpu}
        className="absolute bottom-40 right-[30%]"
        delay={2}
      />
      <FloatingIcon
        icon={Zap}
        className="absolute bottom-60 left-[25%]"
        delay={1.5}
      />
      <div className="flex-1">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Navigation />

          {/* Hero Section */}
          <div className="relative text-center mb-32 mt-24">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] -z-10">
              <div className="absolute inset-0 rotate-12 rounded-full bg-gradient-to-tr from-primary/30 via-accent/20 to-secondary/10 blur-3xl animate-pulse" />
              <div className="absolute inset-0 -rotate-12 rounded-full bg-gradient-to-bl from-secondary/20 via-accent/10 to-primary/30 blur-3xl animate-pulse [animation-delay:2s]" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 text-primary mb-12 border border-primary/10 backdrop-blur-sm shadow-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Powered by AI</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-7xl font-bold mb-12 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient whitespace-pre-line leading-tight"
            >
              AI App & Web3 Development with Artificial Intelligence
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed"
            >
              Transform your ideas into reality with our prompt-based AI
              builder. Choose from multiple AI providers including OpenAI GPT-4,
              Anthropic Claude, and xAI Grok for unlimited generations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center gap-4"
            >
              <Link to="/Generate">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                  Start Building <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <GithubImport />
            </motion.div>
          </div>

          {/* How it Works */}
          <div className="mb-32 max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-12 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
            >
              How It Works
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Describe Your App",
                  description:
                    "Tell us what you want to build using natural language",
                },
                {
                  step: "2",
                  title: "AI Generates Code",
                  description:
                    "Our AI will generate the code in your preferred language",
                },
                {
                  step: "3",
                  title: "Deploy & Share",
                  description:
                    "Deploy your app with one click and share it with the world",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative h-full"
                >
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  <Card className="h-full p-8 backdrop-blur-sm bg-gradient-to-br from-background/80 to-background hover:shadow-xl transition-all duration-300 hover:scale-105 border-primary/10 hover:border-primary/20">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 max-w-5xl mx-auto px-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-primary/10 hover:border-primary/20 relative overflow-hidden backdrop-blur-sm bg-gradient-to-br from-background/80 to-background">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${feature.bgClass}`}>
                      <feature.icon
                        className={`h-6 w-6 ${feature.iconClass}`}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative text-center rounded-3xl p-16 mb-24 max-w-4xl mx-auto overflow-hidden isolate backdrop-blur-sm border border-primary/10 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 -z-10 animate-gradient" />
            <div className="absolute inset-0 bg-grid-white/10 bg-grid-opacity-10 -z-10" />
            <h3 className="text-3xl font-bold mb-6">
              Ready to Start Your AI Journey?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers building the future with Integrety.
            </p>
            <Link to="/Generate">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-white px-8"
              >
                Start Building <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
