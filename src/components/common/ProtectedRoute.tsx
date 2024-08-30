import { CircularProgress } from "@mui/material";
import { createContext, FC, ReactNode } from "react";
import { useUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";

type ProtectRouteType = {
  userInfo: any;
  isLoadingUserInfo: boolean;
};

export const ProtectRouteContext = createContext<ProtectRouteType | null>(null);

type ProtectedRouteProps = {
  children: ReactNode;
};
const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data: userInfo, isFetching: isLoadingUserInfo } = useUser();

  if (isLoadingUserInfo) return <CircularProgress />;

  if (!userInfo) navigate("/login");

  return (
    <ProtectRouteContext.Provider value={{ userInfo, isLoadingUserInfo }}>
      {children}
    </ProtectRouteContext.Provider>
  );
};

export default ProtectedRoute;
