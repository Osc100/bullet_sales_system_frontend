import axios from "axios";
import { NextPage } from "next";
import React, { Fragment, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import AutoTable from "../components/AutoTable";
import FormTableContainer from "../components/FormTableContainer";
import Input from "../components/Input";
import StyledListBox from "../components/StyledListBox";
import { successStringAtom } from "../state/atoms";
import { apiErrorsSelector } from "../state/selectors";
import { BATCHS_URL, PRODUCTS_URL } from "../utils/consts";
import { formDataAsDict, generateAxiosConfig } from "../utils/functions";

const Inventario: NextPage = () => {
  const setApiErrors = useSetRecoilState(apiErrorsSelector);
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [batchs, setBatchs] = useState([]);
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useRecoilState(successStringAtom);

  useEffect(() => {
    const axiosConfig = generateAxiosConfig(window);

    axios
      .get<any[]>(BATCHS_URL + "list_as_table/", axiosConfig)
      .then((res) => {
        console.log(res.data);
        setBatchs(res.data);
      })
      .catch((err) => setApiErrors(err));

    axios
      .get<any[]>(PRODUCTS_URL, axiosConfig)
      .then((res) => setProducts(res.data))
      .catch((err) => setApiErrors(err));

    return () => {
      setBatchs([]);
      setProducts([]);
    };
  }, [setApiErrors, successMessage]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const axiosConfig = generateAxiosConfig(window);

    const formData = formDataAsDict(event);
    if (selectedProduct) formData.product = selectedProduct.id;

    axios
      .post(BATCHS_URL, formData, axiosConfig)
      .then((res) => {
        setSuccessMessage(`El lote se ha agregado satisfactoriamente.`);
      })
      .catch((err) => setApiErrors(err));
  };

  return (
    <Fragment>
      <FormTableContainer>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mt-8">
          <StyledListBox<any>
            objKey="name"
            options={products}
            selected={selectedProduct}
            setSelected={setSelectedProduct}
            descriptiveText="Producto"
            formKeyName="product"
          />
          <Input
            name="quantity"
            descriptiveText="Cantidad Comprada"
            extraLabel={
              selectedProduct &&
              `Unidades disponibles: ${selectedProduct.quantity}`
            }
          />
          <Input
            name="buy_price"
            descriptiveText="Precio al que se compró"
            extraLabel={
              selectedProduct && `Se venderá a: ${selectedProduct.sale_price}`
            }
          />
          <button
            className="col-span-4 mb-2 text-xl rounded-2xl btn btn-accent mx-[25%]"
            formAction="submit"
          >
            GUARDAR LOTE
          </button>
        </form>
        {Object.values(batchs).length > 0 ? (
          <AutoTable tableObj={batchs} />
        ) : (
          <table className="table" />
        )}
      </FormTableContainer>
    </Fragment>
  );
};

export default Inventario;
