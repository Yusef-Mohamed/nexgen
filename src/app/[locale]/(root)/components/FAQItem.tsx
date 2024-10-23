import React from "react";

type FAQItemProps = {
  question: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question }) => {
  return (
    <div className="flex flex-wrap gap-10 justify-between items-center px-8 py-4 w-full rounded-2xl border-2 border-gray-800 border-solid min-h-[80px] mt-4 first:mt-0 max-md:px-5">
      <div className="self-stretch my-auto">{question}</div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/216d6dd5b7253c17961dba031dfc9bbc92c81621928144c518deec7a15957660?placeholderIfAbsent=true&apiKey=6e997725f4ef42d9a5c7140b68d32ddf"
        alt="Expand"
        className="self-stretch object-contain w-12 my-auto shrink-0 aspect-square"
      />
    </div>
  );
};

export default FAQItem;
