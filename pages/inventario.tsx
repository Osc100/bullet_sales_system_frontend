import axios from "axios";
import { NextPage } from "next";
import React, { Fragment, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import AddCategoryModal from "../components/AddCategoryModal";
import AutoTable from "../components/AutoTable";
import FormTableContainer from "../components/FormTableContainer";
import Input from "../components/Input";
import StyledListBox from "../components/StyledListBox";
import { successStringAtom } from "../state/atoms";
import { apiErrorsSelector } from "../state/selectors";
import { CATEGORIES_URL, PRODUCTS_URL } from "../utils/consts";
import { formDataAsDict, generateAxiosConfig } from "../utils/functions";

const Home: NextPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const setApiErrors = useSetRecoilState(apiErrorsSelector);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useRecoilState(successStringAtom);
  const [addCategory, setAddCategory] = useState(false);

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
      .get<any[]>(PRODUCTS_URL + "list_as_table/", axiosConfig)
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
        {Object.values(products).length > 0 ? (
          <AutoTable tableObj={products} />
        ) : (
          <table className="table" />
        )}
      </FormTableContainer>
    </Fragment>
  );
};

export default Home;
