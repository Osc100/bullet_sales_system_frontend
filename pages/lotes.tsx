import axios from "axios";
import { NextPage } from "next";
import React, { Fragment, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import EditIconButton from "../components/EditIconButton";
import EditModal from "../components/EditModal";
import FormTableContainer from "../components/FormTableContainer";
import Input from "../components/Input";
import StyledListBox from "../components/StyledListBox";
import { apiErrorsSelector, successStringSelector } from "../state/selectors";
import { BATCHS_URL, PRODUCTS_URL } from "../utils/consts";
import { formDataAsDict, generateAxiosConfig } from "../utils/functions";

const Inventario: NextPage = () => {
  const setApiErrors = useSetRecoilState(apiErrorsSelector);
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [batchs, setBatchs] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [successMessage, setSuccessMessage] = useRecoilState(
    successStringSelector
  );
  const [deleteBatch, setDeleteBatch] = useState<Batch | undefined>();

  useEffect(() => {
    const axiosConfig = generateAxiosConfig(window);

    axios
      .get<Batch[]>(BATCHS_URL, axiosConfig)
      .then((res) => {
        setBatchs(res.data);
      })
      .catch((err) => setApiErrors(err));

    axios
      .get<Product[]>(PRODUCTS_URL, axiosConfig)
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
      <EditModal
        obj={deleteBatch}
        apiUrl={BATCHS_URL}
        formDict={{}}
        onClose={() => setDeleteBatch(undefined)}
        deleteOnly
      />
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
        <div>
          {Object.values(batchs).length > 0 && (
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Producto</th>
                  <th>Cantidad Inicial</th>
                  <th>Cantidad Actual</th>
                  <th>Precio de compra</th>
                  <th>Total compra</th>
                  <th>Total inventario</th>
                  <th>Fecha comprado</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {batchs.map((batch, index) => (
                  <tr key={"batch-row-" + index}>
                    <td>{index + 1}</td>
                    <td>{batch.product_name}</td>
                    <td>{batch.initial_quantity.toLocaleString()}</td>
                    <td>{batch.quantity.toLocaleString()}</td>
                    <td>{batch.buy_price.toLocaleString()}</td>
                    <td>
                      {(
                        batch.initial_quantity * batch.buy_price
                      ).toLocaleString()}
                    </td>
                    <td>
                      {(batch.quantity * batch.buy_price).toLocaleString()}
                    </td>
                    <td>{batch.date_created.toString()}</td>
                    <td className="flex justify-end">
                      <EditIconButton onClick={() => setDeleteBatch(batch)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </FormTableContainer>
    </Fragment>
  );
};

export default Inventario;
