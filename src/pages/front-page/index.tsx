import LinkButton from "@/components/Buttons/LinkButton";
// import LinkButton from "../../components/Buttons/LinkButton";

function FrontPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5">
      <h1 className="my-5 text-2xl">NoteBot Web</h1>
      <LinkButton href="/about" title="About" />
    </div>
  );
}

export default FrontPage;
