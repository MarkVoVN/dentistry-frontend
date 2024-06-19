import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

function FeatureHighlightSection() {
  return (
    <section className="container flex flex-row justify-evenly py-16">
      {cardlist.map((card, index) => {
        return <HeroCard key={index} card={card} />;
      })}
    </section>
  );
}

export default FeatureHighlightSection;

function HeroCard({
  card,
}: {
  card: { image: string; title: string; text: string };
}) {
  const { image, title, text } = card;
  return (
    <Card className="w-[20vw] rounded-[10px] text-center text-[15px] not-italic font-normal leading-[normal] border-0 border-secondary-800 hover:border-primary h-full gap-4 flex flex-col items-center justify-center p- shadow-none">
      {/* <div className="w-full flex items-center justify-center">{icon}</div> */}
      <Image src={image} alt={title} width={200} height={200} />
      <span className=" text-accent-4">{title}</span>
      <span className=" text-secondary-800 w-[200px]">{text}</span>
    </Card>
  );
}

const cardlist = [
  {
    image: "/home/intro02-saving-time.png",
    title: "Saving Time",
    text: "Reduce the time to look up information by summarizing information from many reputable establishments",
  },
  {
    image: "/home/intro02-search.png",
    title: "Easy to Search",
    text: "Quick search of dental facilities, dentists and services want to do",
  },
  {
    image: "/home/intro02-friendly.png",
    title: "Friendly User Interface",
    text: "User-friendly interface, easy to use",
  },
];
