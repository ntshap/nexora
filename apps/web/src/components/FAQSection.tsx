import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is NEXORA?",
    answer: "An AI-powered DeFi platform that helps creators invest safely and transparently.",
  },
  {
    question: "Do I need crypto experience?",
    answer: "No. NEXORA's AI automates everything while keeping your funds under your control.",
  },
  {
    question: "Is NEXORA safe?",
    answer: "Yes. Funds remain in non-custodial vaults, and every transaction is verifiable on-chain.",
  },
  {
    question: "Can I withdraw anytime?",
    answer: "Absolutely. You retain full ownership and can exit any vault at any time.",
  },
  {
    question: "What makes NEXORA different?",
    answer: "It is built specifically for creative professionals - combining DeFi intelligence with accessibility and trust.",
  },
];

const FAQSection = () => (
  <section
    className="w-full px-6 sm:px-12 lg:px-[100px] py-12 lg:py-20"
    style={{ backgroundColor: "#060613" }}
  >
    <div className="max-w-4xl mx-auto">
      <h2 className="text-[#DDDDDD] text-3xl sm:text-4xl lg:text-[48px] font-plus-jakarta font-extrabold leading-tight lg:leading-[56px] mb-8 lg:mb-12 text-center">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={faq.question}
            value={`item-${index}`}
            className="border border-hero-text/10 rounded-lg px-6 py-2"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.02)" }}
          >
            <AccordionTrigger className="text-[#DDDDDD] text-lg lg:text-xl font-manrope font-semibold hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-[#646464] text-base lg:text-lg font-manrope font-normal leading-relaxed pt-2">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;

