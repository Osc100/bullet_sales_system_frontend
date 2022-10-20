import axios from "axios";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { optionsSaleSelectedAtom } from "../state/atoms";
import { apiErrorsSelector, successStringSelector } from "../state/selectors";
import { SALES_URL } from "../utils/consts";
import { generateAxiosConfig } from "../utils/functions";
import EmptyModal from "./EmpyModal";

const ChangeCompleteSaleCatcher: FC = () => {
  const [completeSale, setCompleteSale] = useRecoilState(
    optionsSaleSelectedAtom
  );
  const setSuccessString = useSetRecoilState(successStringSelector);
  const setApiErrors = useSetRecoilState(apiErrorsSelector);

  const [checked, setChecked] = useState(false);

  const customSetChecked = useCallback(
    (state: boolean) => {
      if (state === false) {
        setCompleteSale(undefined);
      }
      setChecked(state);
    },
    [setCompleteSale]
  );

  useEffect(() => {
    customSetChecked(completeSale !== undefined);
  }, [completeSale, customSetChecked]);

  const handleRevert = () => {
    const axiosConfig = generateAxiosConfig(window);
    axios
      .post(
        SALES_URL + "revert_sale/",
        { sale_id: completeSale.id },
        axiosConfig
      )
      .then((res) => setSuccessString("Se ha revertido la venta exitosamente"))
      .catch((err) => setApiErrors(err))
      .finally(() => customSetChecked(false));
  };

  const handleDelete = () => {
    const axiosConfig = generateAxiosConfig(window);
    axios
      .delete(`${SALES_URL}${completeSale?.id}/`, axiosConfig)
      .then((res) => setSuccessString("Se eliminado la venta exitosamente"))
      .catch((err) => setApiErrors(err))
      .finally(() => customSetChecked(false));
  };

  return (
    <EmptyModal
      checked={checked}
      setChecked={customSetChecked}
      modalID="CompleteSaleOptionsModal"
      containerClasses={"flex flex-col items-center"}
    >
      <Fragment>
        <input hidden />
        <button
          className="w-full btn btn-success hover:opacity-80"
          onClick={handleRevert}
          disabled={completeSale?.reverted}
        >
          REVERTIR VENTA
        </button>
        <button
          className="w-full mt-6 mb-2 btn btn-error hover:opacity-80"
          onClick={handleDelete}
        >
          ELIMINAR
        </button>
        <p className="text-xs text-center text-warning">
          Advertencia: si eliminas esta venta no se podrán recuperar los datos,
          en caso de que haya sido un error se sugiere revertir la misma y no
          eliminar.
        </p>
      </Fragment>
    </EmptyModal>
  );
};

export default ChangeCompleteSaleCatcher;
