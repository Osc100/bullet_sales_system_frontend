import { FC } from "react";

interface EmptyModalProps {
  checked: boolean;
  setChecked: Function;
  containerClasses: string;
  modalID: string;
  children: JSX.Element;
}

const EmptyModal: FC<EmptyModalProps> = ({
  checked,
  containerClasses,
  setChecked,
  modalID,
  children,
}) => {
  return (
    <div>
      <input
        type="checkbox"
        id={modalID}
        className="modal-toggle"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <label htmlFor={modalID} className="text-white cursor-pointer modal">
        <label className={`relative modal-box ${containerClasses}`}>
          {children}
        </label>
      </label>
    </div>
  );
};

export default EmptyModal;
