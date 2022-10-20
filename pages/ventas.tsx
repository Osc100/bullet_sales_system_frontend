import axios from "axios";
import { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ChangeCompleteSaleCatcher from "../components/ChangeCompleteSaleCatcher";
import CompleteSaleTable from "../components/CompleteSaleTable";
import { successStringAtom } from "../state/atoms";
import { apiErrorsSelector } from "../state/selectors";
import { SALES_URL } from "../utils/consts";
import { generateAxiosConfig } from "../utils/functions";

const Inventario: NextPage = () => {
  const setApiErrors = useSetRecoilState(apiErrorsSelector);
  const [completeSales, setCompleteSales] = useState<CompleteSale[]>([]);
  const successString = useRecoilValue(successStringAtom);

  useEffect(() => {
    const axiosConfig = generateAxiosConfig(window);

    axios
      .get<CompleteSale[]>(SALES_URL, axiosConfig)
      .then((res) => setCompleteSales(res.data))
      .catch((err) => setApiErrors(err));

    return () => {
      setCompleteSales([]);
    };
  }, [setApiErrors, successString]);

  return (
    <Fragment>
      <ChangeCompleteSaleCatcher />
      <div className="pt-20 mx-[8%]">
        {completeSales.map((completeSale, index) => (
          <CompleteSaleTable
            completeSale={completeSale}
            key={"complete-sale-" + index}
          />
        ))}
      </div>
    </Fragment>
  );
};

export default Inventario;
