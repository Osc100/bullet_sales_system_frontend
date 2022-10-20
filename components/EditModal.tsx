import axios, { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { apiErrorsSelector, successStringSelector } from "../state/selectors";
import { formDataAsDict, generateAxiosConfig } from "../utils/functions";
import EmptyModal from "./EmpyModal";
import Input from "./Input";

interface EditModalProps<T> {
  apiUrl: string;
  obj?: T;
  /**
   * formDict: keys are the obj access key to send to the API,
   *  values are the descriptive text that will be displayed on the form */
  formDict: Record<string, string>;
  onClose: () => void;
  deleteOnly?: boolean;
}

function EditModal<T extends { id?: number | string }>({
  apiUrl,
  obj,
  formDict,
  onClose,
  deleteOnly = false,
}: EditModalProps<T>): JSX.Element {
  const setSuccessString = useSetRecoilState(successStringSelector);
  const setApiErrors = useSetRecoilState(apiErrorsSelector);

  const [checked, setChecked] = useState(false);
  const objUrl = useRef(apiUrl);

  const [editedObjState, setEditedObjState] = useState(obj);

  const customSetChecked = (state: boolean) => {
    setChecked(state);
    if (state === false) onClose();
  };

  useEffect(() => {
    if (obj !== undefined) {
      setChecked(true);
      objUrl.current = `${apiUrl}${obj?.id}/`;
      setEditedObjState(obj);
    }

    return onClose;
  }, [obj, onClose, apiUrl]);

  const successfulRequest = (res: AxiosResponse) => {
    setSuccessString("Operación realizada con éxito");
    customSetChecked(false);
  };

  const handleDelete = () => {
    const axiosConfig = generateAxiosConfig(window);
    axios
      .delete(objUrl.current, axiosConfig)
      .then(successfulRequest)
      .catch((err) => {
        setApiErrors(err);
        customSetChecked(false);
      });
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const axiosConfig = generateAxiosConfig(window);

    const formData = formDataAsDict(event);

    axios
      .patch(objUrl.current, formData, axiosConfig)
      .then(successfulRequest)
      .catch((err) => setApiErrors(err));
  };

  return (
    <EmptyModal
      checked={checked}
      setChecked={customSetChecked}
      modalID="EditModal"
      containerClasses={"flex flex-col items-center z-10"}
    >
      <div>
        {!deleteOnly && (
          <form onSubmit={handleUpdate}>
            {Object.entries(formDict).map(([key, header], index) => (
              <Input
                key={"edit-modal-input-" + index}
                name={key}
                descriptiveText={header}
                value={editedObjState ? editedObjState[key] : ""}
                onChange={(event) =>
                  setEditedObjState((prev) => ({
                    ...prev,
                    [key]: event.target.value,
                  }))
                }
              />
            ))}
            <button
              className="w-full mx-1 my-8 text-xl rounded-2xl btn btn-accent"
              formAction="submit"
            >
              ACTUALIZAR
            </button>
          </form>
        )}
        <button
          className="w-full text-xl btn btn-error hover:opacity-80 rounded-2xl"
          formAction="none"
          onClick={handleDelete}
        >
          BORRAR
        </button>
      </div>
    </EmptyModal>
  );
}

export default EditModal;
