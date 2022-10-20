import axios from "axios";
import { NextPage } from "next";
import { Fragment, useCallback, useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useSetRecoilState } from "recoil";
import FormTableContainer from "../components/FormTableContainer";
import Input from "../components/Input";
import StyledListBox from "../components/StyledListBox";
import { apiErrorsAtom } from "../state/atoms";
import { apiErrorsSelector, successStringSelector } from "../state/selectors";
import { PRODUCTS_URL, SALES_URL } from "../utils/consts";
import { generateAxiosConfig } from "../utils/functions";

const Inventario: NextPage = () => {
  const setApiErrors = useSetRecoilState(apiErrorsSelector);
  const setApiErrorsRaw = useSetRecoilState(apiErrorsAtom);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [products, setProducts] = useState<Product[]>([]);
  const setSuccessMessage = useSetRecoilState(successStringSelector);
  const [quantity, setQuantity] = useState(0);

  const [availableUnits, setAvailableUnits] = useState(-1);
  const [sellProducts, setSellProducts] = useState<SellProduct[]>([]);

  const findSellProductWithAProduct = useCallback(
    (product: Product) =>
      sellProducts.filter((p) => p.product.id === product.id)[0],
    [sellProducts]
  );

  useEffect(() => {
    if (selectedProduct !== undefined) {
      let productUnits = selectedProduct.quantity;

      let sellProductOfSelectedProduct =
        findSellProductWithAProduct(selectedProduct);

      if (sellProductOfSelectedProduct !== undefined) {
        productUnits -= sellProductOfSelectedProduct.quantity;
      }

      setAvailableUnits(productUnits);
    }
  }, [findSellProductWithAProduct, selectedProduct]);

  const addSellProduct = (sellProduct: SellProduct) => {
    let sellProductOfProduct = findSellProductWithAProduct(sellProduct.product);

    if (sellProductOfProduct !== undefined) {
      setSellProducts((prev) => {
        let newArr = [...prev];
        let sellProductIndex = prev.indexOf(sellProductOfProduct);
        let sellProductCopy = { ...prev[sellProductIndex] }; // since is a shallow copy, you should clone this one too

        sellProductCopy.quantity += sellProduct.quantity;
        newArr[sellProductIndex] = sellProductCopy;

        return newArr;
      });
    } else {
      setSellProducts((prev) => [...prev, sellProduct]);
    }
  };

  const removeSellProduct = (sellProduct: SellProduct) => {
    setSellProducts((prev) =>
      prev.filter((p) => p.product.id !== sellProduct.product.id)
    );
  };

  useEffect(() => {
    const axiosConfig = generateAxiosConfig(window);

    axios
      .get<Product[]>(PRODUCTS_URL, axiosConfig)
      .then((res) => setProducts(res.data))
      .catch((err) => setApiErrors(err));

    return () => {
      setProducts([]);
    };
  }, [setApiErrors]);

  const handleAddProduct = () => {
    if (!selectedProduct) {
      setApiErrorsRaw({ product: "No puede estar en blanco." });
      return;
    }

    if (quantity > availableUnits) {
      setApiErrorsRaw({
        quantity: "No puedes añadir más unidades de las disponibles.",
      });
      return;
    }

    if (quantity === 0) {
      setApiErrorsRaw({ quantity: "No puede estar en blanco." });
      return;
    }

    setApiErrorsRaw({});

    addSellProduct({ quantity: quantity, product: selectedProduct });
  };

  const handleSellAllProducts = () => {
    const axiosConfig = generateAxiosConfig(window);

    const cleanedSellProducts = sellProducts.map((sellProduct) => ({
      product: sellProduct.product.id,
      quantity: sellProduct.quantity,
    }));

    axios
      .post(SALES_URL + "sell/", cleanedSellProducts, axiosConfig)
      .then((res) => {
        setSuccessMessage("Se ha efectuado la venta con éxito");
      })
      .catch((err) => setApiErrors(err));
  };

  return (
    <Fragment>
      <FormTableContainer>
        <div className="grid grid-cols-2 gap-4 mt-8">
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
            max={
              availableUnits < 0 ? availableUnits : selectedProduct?.quantity
            }
            extraLabel={
              selectedProduct && `Unidades disponibles: ${availableUnits}`
            }
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />

          <button
            className="text-xl rounded-2xl btn-outline btn btn-accent "
            formAction="submit"
            onClick={handleAddProduct}
          >
            AGREGAR AL CARRO
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
          <button
            className="col-span-2 mb-2 text-xl rounded-2xl btn-outline btn btn-accent "
            formAction="submit"
            onClick={handleSellAllProducts}
            disabled={sellProducts.length === 0}
          >
            EFECTUAR VENTA
          </button>
        </div>

        <div className="mt-8">
          <h1 className="pb-2 text-2xl text-center">Carrito</h1>
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sellProducts.map((sellProduct, index) => (
                <tr key={"cart-sellProduct-" + index}>
                  <td>{index + 1}</td>
                  <td>{sellProduct.product.name}</td>
                  <td>{sellProduct.quantity.toLocaleString()}</td>
                  <td>{sellProduct.product.sale_price.toLocaleString()}</td>
                  <td>
                    {(
                      sellProduct.product.sale_price * sellProduct.quantity
                    ).toLocaleString()}
                  </td>
                  <td className="flex justify-end">
                    <IoMdCloseCircle
                      className="cursor-pointer text-success hover:text-info"
                      size={24}
                      onClick={() => removeSellProduct(sellProduct)}
                    />
                  </td>
                </tr>
              ))}
              {sellProducts.length > 0 && (
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td>
                    {sellProducts
                      .reduce(
                        (partialSum, sellProduct) =>
                          partialSum +
                          sellProduct.quantity * sellProduct.product.sale_price,
                        0
                      )
                      .toLocaleString()}
                  </td>
                  <td />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </FormTableContainer>
    </Fragment>
  );
};

export default Inventario;
