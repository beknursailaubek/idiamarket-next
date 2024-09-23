"use client";
import React, { useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.modalOverlayActive : ""}`} onClick={handleClickOutside as React.MouseEventHandler<HTMLDivElement>}>
      <div className={`${styles.modalContent} ${isOpen ? styles.modalContentActive : ""}`} ref={modalRef}>
        <Image className={styles.modalClose} src="/images/icons/close.svg" alt="" onClick={onClose} width={24} height={24} />
        {children}
      </div>
    </div>
  );
};

export default Modal;
