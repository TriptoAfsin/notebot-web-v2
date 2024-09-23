import LinkButton from "@/components/Buttons/LinkButton";
import CenterWrapper from "@/components/Layout/CenterWrapper";

function AboutPage() {
  return (
    <CenterWrapper className="min-h-screen">
      <h1 className="text-2xl my-5">
        About React + TypeScript + Vite + Tailwind CSS + Redux Toolkit
      </h1>
      <LinkButton href="/" title="Home" />
    </CenterWrapper>
  );
}

export default AboutPage;
