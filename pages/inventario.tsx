import axios from "axios";
import { NextPage } from "next";
import React, { Fragment, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import AddCategoryModal from "../components/AddCategoryModal";
import EditIconButton from "../components/EditIconButton";
import EditModal from "../components/EditModal";
import FormTableContainer from "../components/FormTableContainer";
import Input from "../components/Input";
import StyledListBox from "../components/StyledListBox";
import { apiErrorsSelector, successStringSelector } from "../state/selectors";
import { CATEGORIES_URL, PRODUCTS_URL } from "../utils/consts";
import { formDataAsDict, generateAxiosConfig } from "../utils/functions";

const Home: NextPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const setApiErrors = useSetRecoilState(apiErrorsSelector);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [products, setProducts] = useState<Product[]>([]);
  const [successMessage, setSuccessMessage] = useRecoilState(
    successStringSelector
  );
  const [addCategory, setAddCategory] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();

  // Fetching data
  useEffect(() => {
    console.log("products");
    const axiosConfig = generateAxiosConfig(window);

    axios
      .get<Category[]>(CATEGORIES_URL, axiosConfig)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => setApiErrors(err));

    axios
      .get<Product[]>(PRODUCTS_URL, axiosConfig)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((err) => setApiErrors(err));

    return () => {
      setCategories([]);
      setProducts([]);
    };
  }, [setApiErrors, successMessage]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const axiosConfig = generateAxiosConfig(window);

    const formData = formDataAsDict(event);
    if (selectedCategory) formData.category = selectedCategory.id;

    axios
      .post(PRODUCTS_URL, formData, axiosConfig)
      .then((res) => {
        setSuccessMessage(
          `El producto ${formData.name} se ha agregado satisfactoriamente.`
        );
      })
      .catch((err) => setApiErrors(err));
  };

  return (
    <Fragment>
      {addCategory && (
        <AddCategoryModal onCloseModal={() => setAddCategory(false)} />
      )}
      <EditModal
        obj={editProduct}
        apiUrl={PRODUCTS_URL}
        formDict={{
          name: "Nombre del producto",
          sale_price: "Precio de venta unitario",
          alert_quantity: "Cantidad de alerta",
        }}
        onClose={() => setEditProduct(undefined)}
      />
      <FormTableContainer>
        <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 mt-8">
          <Input name="name" descriptiveText="Nombre del producto" />
          <StyledListBox<Category>
            objKey="name"
            options={categories}
            selected={selectedCategory}
            setSelected={setSelectedCategory}
            descriptiveText="Categoría"
            formKeyName="category"
            addable
            addAction={() => setAddCategory(true)}
          />
          <Input name="sale_price" descriptiveText="Precio de venta unitario" />
          <Input name="alert_quantity" descriptiveText="Cantidad de alerta" />
          <button
            className="col-span-4 mb-2 text-xl rounded-2xl btn btn-accent mx-[25%]"
            formAction="submit"
          >
            GUARDAR
          </button>
        </form>
        <div className="mt-4 ">
          {Object.values(products).length > 0 && (
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Categoría</th>
                  <th>Producto</th>
                  <th>C. Alerta</th>
                  <th>Cantidad</th>
                  <th>Precio de Venta</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={"product-row-" + index}>
                    <td>{index + 1}</td>
                    <td>{product.category}</td>
                    <td>{product.name}</td>
                    <td>{product.alert_quantity}</td>
                    <td
                      className={
                        product.alert_quantity > product.quantity
                          ? "text-error"
                          : undefined
                      }
                    >
                      {product.quantity.toLocaleString()}
                    </td>
                    <td>{product.sale_price.toLocaleString()}</td>
                    <td>
                      {(product.sale_price * product.quantity).toLocaleString()}
                    </td>
                    <td className="flex justify-end">
                      <EditIconButton onClick={() => setEditProduct(product)} />
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

export default Home;
