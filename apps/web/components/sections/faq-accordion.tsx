"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/types/faq";

interface FaqAccordionProps {
  faqs: Faq[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className="rounded-lg border border-slate-200 bg-white px-6 shadow-xs"
        >
          <AccordionTrigger className="text-left text-sm font-semibold text-slate-900 hover:no-underline hover:text-primary py-5">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-5">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
