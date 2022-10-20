import { FC } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { useSetRecoilState } from "recoil";
import { optionsSaleSelectedAtom } from "../state/atoms";

interface CompleteSaleTableProps {
  completeSale: CompleteSale;
}

const CompleteSaleTable: FC<CompleteSaleTableProps> = ({ completeSale }) => {
  const setSelectedSaleOptions = useSetRecoilState(optionsSaleSelectedAtom);

  return (
    <div className="pb-8">
      <div className="grid grid-cols-5 pt-3 w-full pb-2 -mb-1 text-xl font-bold bg-base-200 rounded-t-3xl px-[1%]">
        <p className="absolute">{completeSale.id}</p>
        <p className="col-span-2 pl-[3.7rem]">{`Venta efectuada por: ${completeSale.sold_by_name}`}</p>
        <p>{`Fecha: ${completeSale.date_sold.toString()}`}</p>
        <p>{`Revertida: ${completeSale.reverted ? "Si" : "No"}`}</p>
        <div className="flex items-center justify-end pr-[4.5rem]">
          <AiOutlineSetting
            size={24}
            className="transition duration-300 cursor-pointer hover:rotate-90 hover:text-success"
            onClick={() => setSelectedSaleOptions(completeSale)}
          />
        </div>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th />
            <th>Categoría del producto</th>
            <th>Producto</th>
            <th>Precio de venta</th>
            <th>Cantidad vendida</th>
            <th>Total ventas</th>
            <th>Costo de venta</th>
            <th>Ventas netas</th>
          </tr>
        </thead>
        <tbody>
          {completeSale.sales.map((sale, index) => (
            <tr key={`completesale-${completeSale.id}-tr-${index}`}>
              <td>{index + 1}</td>
              <td>{sale.category_name}</td>
              <td>{sale.product_name}</td>
              <td>{sale.unit_price}</td>
              <td>{sale.quantity_sold}</td>
              <td>{sale.total_sold}</td>
              <td>{sale.total_cost}</td>
              <td>{sale.total_renevue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompleteSaleTable;
