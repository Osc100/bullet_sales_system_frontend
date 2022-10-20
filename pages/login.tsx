import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useSetRecoilState } from "recoil";
import Input from "../components/Input";
import { apiErrorsSelector } from "../state/selectors";
import { BACKEND_URL } from "../utils/consts";
import { formDataAsDict } from "../utils/functions";

const Home: NextPage = () => {
  const setApiErrors = useSetRecoilState(apiErrorsSelector);
  const router = useRouter();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = formDataAsDict(event);
    axios
      .post(BACKEND_URL + "login/", formData)
      .then((res) => {
        window.sessionStorage.setItem("token", `Token ${res.data.token}`);
        window.sessionStorage.setItem(
          "user",
          `${res.data.user.first_name} ${res.data.user.last_name}`
        );
        router.push("/inventario");
      })
      .catch((err) => setApiErrors(err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center h-screen flex-col mx-[8%] "
    >
      <div className="p-10 border shadow-2xl border-base-100 rounded-2xl">
        <div className="w-[32rem] ">
          <h1 className="py-4 text-4xl font-bold text-center transition-colors duration-300 btn-ghost rounded-3xl">
            Bullet Sales System
          </h1>
          <Input
            type="text"
            name="username"
            descriptiveText="Nombre de usuario"
          />
          <Input type="password" name="password" descriptiveText="Contraseña" />
          <button formAction="submit" className="w-full mt-8 btn btn-accent">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </form>
  );
};

export default Home;
