import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import NavBar from "../components/NavBar";
import NonFieldErrorCatcher from "../components/NonFieldErrorCatcher";
import SuccessStringCatcher from "../components/SucessStringCatcher";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [showNavBar, setShowNavBar] = useState(true);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (router.pathname !== "/login") {
      if (!token) {
        router.push("/login");
      }
    } else {
      setShowNavBar(false);
    }

    return () => setShowNavBar(true);
  }, [router]);
  return (
    <RecoilRoot>
      <NonFieldErrorCatcher />
      <SuccessStringCatcher />
      {showNavBar && <NavBar />}
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
