import Top from "@/components/ui/Top";
import Main from "@/components/ui/Main";
import Bottom from "@/components/ui/Bottom";

const Layout = () => {
  return (
    <div className="absolute top-0 w-full h-full bottom-0 flex flex-col">
      <Top></Top>
      <Main></Main>
      <Bottom></Bottom>
    </div>
  );
};
export default Layout;
