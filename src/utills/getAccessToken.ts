import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const getAccessToken = (): string => {
  const navigate = useNavigate();
  const access_token = Cookies.get("access_token");
  if (!access_token) {
    navigate("/admin/login");
    return "";
  }

  return access_token;
};
