import AppRoutes from "../routes/AppRoutes";

interface MainContentProps {
  isAuthPage: boolean;
}

const MainContent = ({ isAuthPage }: MainContentProps) => {
  return (
    <>
      <div className={isAuthPage ? "" : "space-y-5 py-5"}>
        <AppRoutes />
      </div>
    </>
  );
};

export default MainContent;
