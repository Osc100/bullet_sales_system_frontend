import { FC } from "react";
import { AiOutlineEdit } from "react-icons/ai";

interface EditIconButtonProps {
  onClick: () => void;
}

const EditIconButton: FC<EditIconButtonProps> = ({ onClick }) => {
  return (
    <AiOutlineEdit
      size={24}
      className="cursor-pointer hover:text-success"
      onClick={onClick}
    />
  );
};

export default EditIconButton;
