import React from "react";

type InstructorCardProps = {
  name: string;
  imageSrc: string;
  badgeSrc: string;
};

const InstructorCard: React.FC<InstructorCardProps> = ({
  name,
  imageSrc,
  badgeSrc,
}) => {
  return (
    <div className="flex flex-col items-center self-stretch p-4 my-auto bg-muted rounded-3xl">
      <div className="flex overflow-hidden relative flex-col w-full flex-wrap gap-2.5 items-start px-2.5 pt-4 pb-64 max-w-full rounded-2xl aspect-[1.241] max-md:pb-24">
        <img
          loading="lazy"
          src={imageSrc}
          alt={name}
          className="absolute inset-0 object-cover w-full size-full"
        />
        <img
          loading="lazy"
          src={badgeSrc}
          alt="Instructor badge"
          className="object-contain w-12 aspect-square"
        />
      </div>
      <div className="mt-5 text-xl font-medium leading-snug text-center text-neutral-900">
        {name}
      </div>
    </div>
  );
};

export default InstructorCard;
