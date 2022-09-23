import { FC } from "react";
import EmptyModal from "./EmpyModal";

interface ModalTextProps {
  text: string;
  checked: boolean;
  setChecked: Function;
  containerClasses: string;
  modalID: string;
}

const ModalText: FC<ModalTextProps> = ({
  checked,
  containerClasses,
  setChecked,
  text,
  modalID,
}) => {
  return (
    <EmptyModal
      checked={checked}
      setChecked={setChecked}
      modalID={modalID}
      containerClasses={containerClasses}
    >
      <h3 className="text-lg font-bold">{text}</h3>
    </EmptyModal>
  );
};

export default ModalText;
