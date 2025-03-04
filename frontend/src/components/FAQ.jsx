import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // You can use these icons or other icons

const FAQ = () => {
  // State to manage the expanded/collapsed state of each FAQ
  const [expanded, setExpanded] = useState([false, false, false, false, false]);

  // Toggle the expanded state of the clicked FAQ
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
    <div className="max-w-full mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8">FAQ's</h2>

      {faqData.map((faq, index) => (
        <div
          key={index}
          className="mb-4 overflow-hidden transition-all duration-500 hover:translate-y-2 hover:shadow-xl hover:border-gray-300"
        >
          <div
            onClick={() => toggleExpanded(index)}
            className="flex justify-between items-center cursor-pointer p-4 bg-gray-100 border rounded-md"
          >
            <h3 className="text-xl font-semibold">{faq.question}</h3>
            {expanded[index] ? (
              <ChevronUp size={24} className="text-blue-500" />
            ) : (
              <ChevronDown size={24} className="text-blue-500" />
            )}
          </div>

          {expanded[index] && (
            <p className="mt-2 p-4 bg-gray-50 rounded-md text-gray-700">
              {faq.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
