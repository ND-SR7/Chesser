import { IoIosCloseCircle } from "react-icons/io";
import ModalStyled from "./Modal.styled";
import ModalContentBox from "./ModalContetBox/ModalContetBoxStyled";
import CloseButton from "../CloseButton/CloseButtonStyled";
import Heading from "../Heading/HeadingStyled";

interface ModalProps {
  heading: string;
  content: any;
  isVisible: boolean;
  onClose?: () => void;
}

const Modal = ({ heading, content, isVisible, onClose }: ModalProps) => {
  const closeBtn = onClose ? 
    (
    <CloseButton onClick={() => onClose()}>
      <IoIosCloseCircle />
    </CloseButton>
    ) : null;

  return isVisible ? (
    <ModalStyled>
      <ModalContentBox>
        {closeBtn}
        <Heading>{heading}</Heading>
        <section>{content}</section>
      </ModalContentBox>
    </ModalStyled>
  ) : null;
};

export default Modal;
