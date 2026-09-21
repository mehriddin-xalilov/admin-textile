import axios from "axios";
import { get } from "lodash";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../../config.ts";
import { notification } from "../../components/index.tsx";
import useHooks from "../../hooks/useHooks.tsx";
import { queryBuilder, storage, useStore } from "../../services/index.ts";

const Index = () => {
  const { t } = useHooks();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore()

  const token = get(user, "token");
  const { setUser, setLogout, setGetMeLoading } = useStore();

  useEffect(() => {
    storage.set("token", token as string);

    axios
      .get(
        queryBuilder(`${config.API_ROOT}/get-me`, {
          include: 'roles.permissions,permissions,avatar'
        }),
        {
          headers: {
            Authorization: `Bearer ${storage.get("token")}`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0"
          }
        }
      )
      .then(data => {
        setUser({
          data: get(data, "data.data"),
          isAuth: true,
          token: token as string,
          refreshToken: get(data, "data.data.refreshToken")
        });
        storage.set("token", token as string);
        setGetMeLoading(false);
        const url = new URL(window.location.href);
        if (url.searchParams.has("token")) {
          url.searchParams.delete("token");
          window.history.replaceState({}, document.title, url.toString());
        }

        if (location.pathname === "/login") {
          navigate("/");
        }
      })
      .catch(error => {
        if (!get(storage, "token") && location.pathname !== "/login" && location.pathname !== "/register") {
          navigate("/login");
          setLogout();
        }
        setGetMeLoading(false);
        if (token) {
          notification({
            type: "error",
            message: t(
              get(
                error,
                "response.data.errorMessage",
                t("Что-то пошло не так!")
              )
            )
          });
          navigate(location.pathname);
        }
        setLogout();
      });
  }, [token]);



  return null;
};

export default Index;
