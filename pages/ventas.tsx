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
import { PRODUCTS_URL, SALES_URL } from "../utils/consts";
import { formDataAsDict, generateAxiosConfig } from "../utils/functions";

const Inventario: NextPage = () => {
  const setApiErrors = useSetRecoilState(apiErrorsSelector);
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useRecoilState(successStringAtom);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const axiosConfig = generateAxiosConfig(window);

    axios
      .get<any[]>(SALES_URL + "list_as_table/", axiosConfig)
      .then((res) => {
        console.log(res.data);
        setSales(res.data);
      })
      .catch((err) => setApiErrors(err));

    axios
      .get<any[]>(PRODUCTS_URL, axiosConfig)
      .then((res) => setProducts(res.data))
      .catch((err) => setApiErrors(err));

    return () => {
      setSales([]);
      setProducts([]);
    };
  }, [setApiErrors, successMessage]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const axiosConfig = generateAxiosConfig(window);

    const formData = formDataAsDict(event);
    if (selectedProduct) formData.product = selectedProduct.id;

    axios
      .post(SALES_URL + "sell/", formData, axiosConfig)
      .then((res) => {
        setSuccessMessage(`Se ha efectuado la venta con éxito`);
      })
      .catch((err) => setApiErrors(err));
  };

  return (
    <Fragment>
      <FormTableContainer>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-8">
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
            descriptiveText="Unidades a vender"
            type="number"
            min={0}
            extraLabel={
              selectedProduct &&
              `Unidades disponibles: ${selectedProduct.quantity}`
            }
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />

          <button
            className="mb-2 text-xl rounded-2xl btn-outline btn btn-accent "
            formAction="submit"
          >
            VENDER
          </button>

          {selectedProduct && (
            <div className="flex items-center justify-center w-full h-full ">
              <p className="text-center text-warning">
                {`Cada unidad se venderá a ${
                  selectedProduct.sale_price
                } haciendo un total de: ${
                  selectedProduct.sale_price * quantity
                }`}
              </p>
            </div>
          )}
        </form>
        {Object.values(sales).length > 0 ? (
          <AutoTable tableObj={sales} />
        ) : (
          <table className="table" />
        )}
      </FormTableContainer>
    </Fragment>
  );
};

export default Inventario;
