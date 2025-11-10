import { useState, useEffect } from "react";
import Accordion from "./Accordion";
import { getActiveFAQs } from "../../../services/faqService";

export default function AnimatedAccordionPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    const { data, error } = await getActiveFAQs();
    if (error) {
      console.error("Error fetching FAQs:", error);
    } else {
      setFaqs(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="relative flex flex-col justify-center overflow-hidden">
        <div className="w-full mx-auto px-4 md:px-6">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-khaki"></div>
          </div>
        </div>
      </main>
    );
  }

  if (faqs.length === 0) {
    return (
      <main className="relative flex flex-col justify-center overflow-hidden">
        <div className="w-full mx-auto px-4 md:px-6">
          <div className="text-center py-20">
            <p className="text-gray dark:text-lightGray font-Lora text-lg">
              No FAQs available at the moment. Please check back later.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex flex-col justify-center overflow-hidden">
      <div className="w-full mx-auto px-4 md:px-6">
        <div
          className="grid items-end grid-cols-1 lg:grid-cols-2 gap-x-[30px]"
          data-aos="zoom-in-up"
          data-aos-duration="1000"
        >
          {faqs.map((faq, index) => (
            <Accordion
              key={faq.id}
              title={faq.question}
              id={`faqs-${faq.id}`}
              active={index === 0}
            >
              {faq.answer}
            </Accordion>
          ))}
        </div>
      </div>
    </main>
  );
}
