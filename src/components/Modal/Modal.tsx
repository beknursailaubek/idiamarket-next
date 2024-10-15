"use client";
import React, { useEffect, useRef, ReactNode, useState } from "react";
import Image from "next/image";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [startY, setStartY] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    setStartY(touch.clientY);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!startY) return;

    const touch = event.touches[0];
    const swipeDistance = touch.clientY - startY;

    if (swipeDistance > 100) {
      onClose();
    }
  };

  const handleTouchEnd = () => {
    setStartY(null);
  };

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.modalOverlayActive : ""}`} onClick={handleClickOutside}>
      <div className={`${styles.modalContent} ${isOpen ? styles.modalContentActive : ""}`} ref={modalRef}>
        <Image className={styles.modalClose} src="/images/icons/close.svg" alt="" onClick={onClose} width={24} height={24} />
        {children}
        <div className={styles.modalSwipeDown} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}></div>
      </div>
    </div>
  );
};

export default Modal;
