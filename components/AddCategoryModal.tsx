import axios from "axios";
import { FC, useState } from "react";
import { useSetRecoilState } from "recoil";
import { apiErrorsSelector, successStringSelector } from "../state/selectors";
import { CATEGORIES_URL } from "../utils/consts";
import { formDataAsDict, generateAxiosConfig } from "../utils/functions";
import EmptyModal from "./EmpyModal";
import Input from "./Input";

interface AddCategoryModalProps {
  onCloseModal: () => void;
}

const AddCategoryModal: FC<AddCategoryModalProps> = ({ onCloseModal }) => {
  const [checked, _] = useState(true);
  const setSuccessString = useSetRecoilState(successStringSelector);
  const setApiErrors = useSetRecoilState(apiErrorsSelector);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const axiosConfig = generateAxiosConfig(window);
    const formData = formDataAsDict(event);

    axios
      .post<Category>(CATEGORIES_URL, formData, axiosConfig)
      .then((res) => {
        onCloseModal();
        setSuccessString("Se ha agregado la categoría correctamente.");
      })
      .catch((err) => setApiErrors(err));
  };
  return (
    <EmptyModal
      checked={checked}
      setChecked={onCloseModal}
      modalID="AddCategoryModal"
      containerClasses={"flex flex-col items-center"}
    >
      <form className="" onSubmit={handleSubmit}>
        <Input
          name="name"
          className=""
          descriptiveText="Ingrese el nombre de la categoría"
        />
        <button className="w-full mt-3 btn btn-accent">GUARDAR</button>
      </form>
    </EmptyModal>
  );
};

export default AddCategoryModal;
