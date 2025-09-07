import { useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";

import HeadingStyled from "../Heading/Heading.styled";
import CloseButtonStyled from "../CloseButton/CloseButton.styled";
import ModalStyled from "./Modal.styled";
import ModalContentBoxStyled from "./ModalContetBox/ModalContetBox.styled";

interface ModalProps {
  heading: string;
  content: any;
  isVisible: boolean;
  onClose: () => void;
  closeable: boolean;
}

const Modal = ({heading, content, isVisible, onClose, closeable}: ModalProps) => {
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeable) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, closeable, onClose]);

  const closeBtn = closeable ? 
    (
    <CloseButtonStyled onClick={() => onClose()}>
      <IoIosCloseCircle />
    </CloseButtonStyled>
    ) : null;

  return isVisible ? (
    <ModalStyled>
      <ModalContentBoxStyled>
        {closeBtn}
        <HeadingStyled>{heading}</HeadingStyled>
        <section>{content}</section>
      </ModalContentBoxStyled>
    </ModalStyled>
  ) : null;
};

export default Modal;
