import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [expanded, setExpanded] = useState([false, false, false, false, false]);

  const toggleExpanded = (index) => {
    setExpanded((prev) =>
      prev.map((item, idx) => (idx === index ? !item : item))
    );
  };

  const faqData = [
    {
      question: "What is Wildfire Watch?",
      answer:
        "Wildfire Watch is a predictive platform that uses advanced weather data and technology to predict wildfire incidents. It helps individuals and communities stay informed about potential fire hazards, providing them with the tools to prepare and take necessary precautions to protect themselves, their property, and the environment.",
    },
    {
      question: "How does Wildfire Watch predict wildfire incidents?",
      answer:
        "Wildfire Watch uses real-time data from weather monitoring systems, satellite imagery, and AI-powered algorithms to analyze environmental factors such as temperature, humidity, and wind conditions. By analyzing these variables, the platform can predict potential wildfire risks and provide early warnings to users.",
    },
    {
      question: "How can I stay safe during a wildfire using Wildfire Watch?",
      answer:
        "Wildfire Watch provides crucial safety guidelines and real-time alerts, allowing users to take necessary precautions. You’ll receive updates on areas at risk, evacuation routes, and tips on how to safeguard your property. Additionally, the platform helps you develop a fire safety plan and stay informed on how to minimize exposure to smoke and flames.",
    },
    {
      question: "Is Wildfire Watch available for everyone?",
      answer:
        "Yes, Wildfire Watch is available to the general public, community organizations, and government agencies. By offering accessible and reliable wildfire predictions, we aim to empower everyone with the knowledge they need to reduce fire risks and respond effectively when a wildfire is predicted.",
    },
    {
      question: "Can Wildfire Watch help me track ongoing wildfires?",
      answer:
        "Yes, Wildfire Watch not only predicts potential wildfires but also provides real-time tracking of ongoing wildfire incidents. The platform offers live updates on fire locations, containment status, evacuation notices, and safety alerts, helping users stay informed and make timely decisions to protect themselves and their loved ones.",
    },
  ];

  return (
    <div className="max-w-full mx-auto my-8 p-6  flex flex-col md:flex-row items-center justify-between">
      <div className="w-full md:w-1/3 mb-4 md:mb-0">
        <img
          src="/images/faq.jpg"
          alt="Wildfire"
          className="w-full h-[550px] object-cover rounded-lg mx-2" 
        />
      </div>

      <div className="w-full md:w-2/3 pl-0 md:pl-4 mt-4 md:mt-0">
        <p className="text-xl font-bold font-serif text-left text-red-800 mb-6">
          Our Queries
        </p>
        <h2 className="text-2xl font-bold font-serif text-left mb-6">
          Frequently Asked Questions
        </h2>
        <div className="max-h-[500px] overflow-y-auto">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="mb-3 w-full max-w-[500px] overflow-hidden transition-all duration-500 hover:translate-y-2 hover:shadow-xl hover:border-gray-300"
            >
              <div
                onClick={() => toggleExpanded(index)}
                className="flex justify-between items-center cursor-pointer p-3 bg-gray-100 border rounded-md"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                {expanded[index] ? (
                  <ChevronUp size={20} className="text-blue-500" />
                ) : (
                  <ChevronDown size={20} className="text-blue-500" />
                )}
              </div>

              {expanded[index] && (
                <p className="mt-2 p-3 bg-gray-50 rounded-md text-gray-700">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
