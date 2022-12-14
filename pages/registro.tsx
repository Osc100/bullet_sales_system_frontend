import axios from "axios";
import { FC } from "react";
import { useSetRecoilState } from "recoil";
import Input from "../components/Input";
import { apiErrorsSelector, successStringSelector } from "../state/selectors";
import { REGISTER_URL } from "../utils/consts";
import { formDataAsDict, generateAxiosConfig } from "../utils/functions";

interface RegisterProps {}

const Register: FC<RegisterProps> = () => {
  const setApiErrors = useSetRecoilState(apiErrorsSelector);
  const setSuccessString = useSetRecoilState(successStringSelector);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const axiosConfig = generateAxiosConfig(window);

    const formData = formDataAsDict(event);

    axios
      .post(REGISTER_URL, formData, axiosConfig)
      .then((res) => {
        setSuccessString(
          `Se ha registrado al usuario: ${res.data.username} con éxito.`
        );
      })
      .catch((err) => setApiErrors(err));
  };

  return (
    <div className="flex justify-center">
      <form
        className="flex flex-col items-center justify-center w-[32rem] h-screen "
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          name="username"
          descriptiveText="Nombre de usuario"
        />
        <Input type="text" name="first_name" descriptiveText="Nombres" />
        <Input type="text" name="last_name" descriptiveText="Apellidos" />
        <Input type="email" name="email" descriptiveText="Correo electrónico" />
        <Input type="password" name="password1" descriptiveText="Contraseña" />
        <Input
          type="password"
          name="password2"
          descriptiveText="Confirmar la contraseña"
        />
        <div className="flex items-center w-full py-4 text-xl">
          <p>Es superusuario: </p>
          <input
            type="checkbox"
            name="is_superuser"
            className="ml-4 checkbox checkbox-accent"
          />
        </div>
        <button
          className="w-full mt-1 btn btn-success btn-outline"
          formAction="submit"
        >
          REGISTRAR USUARIO
        </button>
      </form>
    </div>
  );
};

export default Register;
