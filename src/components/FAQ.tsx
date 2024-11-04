import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  export function FAQ() {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Integrety?</AccordionTrigger>
            <AccordionContent>
              Integrety is an AI-powered development platform that helps you build
              and deploy Web3 and AI applications with ease. Using natural
              language prompts, you can generate code in various languages
              including NEAR Protocol, Rust, and Mojo.
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-2">
            <AccordionTrigger>Do I need coding experience?</AccordionTrigger>
            <AccordionContent>
              No coding experience is required! Our AI understands natural
              language prompts and generates production-ready code for you.
              However, basic understanding of blockchain and AI concepts will help
              you make the most of the platform.
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-3">
            <AccordionTrigger>
              What kind of applications can I build?
            </AccordionTrigger>
            <AccordionContent>
              You can build a wide range of applications including smart
              contracts, NFT marketplaces, DeFi protocols, AI-powered dApps,
              machine learning models, and more. Our platform supports both Web3
              and AI development workflows.
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-4">
            <AccordionTrigger>
              How does the deployment process work?
            </AccordionTrigger>
            <AccordionContent>
              We offer one-click deployment to Netlify for your applications. The
              platform automatically handles the build process, configuration, and
              deployment, making it seamless to get your app live on the internet.
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-5">
            <AccordionTrigger>Is my code saved automatically?</AccordionTrigger>
            <AccordionContent>
              Yes, all your generated code is automatically saved in your history.
              You can access your previous generations, make modifications, and
              redeploy them at any time.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
  