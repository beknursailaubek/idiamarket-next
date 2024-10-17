import Link from "next/link";
import Image from "next/image";
import styles from "./Contacts.module.css";

interface ContactsProps {
  closeModal: () => void;
}

const Contacts = ({ closeModal }: ContactsProps) => {
  return (
    <div className={styles.contactsModal}>
      <p className={styles.title}>Наши контакты</p>
      <div className={styles.contacts}>
        <div className={styles.contactsCity}>
          <span className={styles.contactsCityName}>Алматы</span>
          <Link href="tel:87013667700" className={styles.contactsCityPhone}>
            +7 (701) 266-77-00
          </Link>
        </div>

        <div className={styles.contactsCity}>
          <span className={styles.contactsCityName}>Астана </span>
          <Link href="tel:87015112200" className={styles.contactsCityPhone}>
            +7 (701) 511-22-00
          </Link>
        </div>

        <div className={styles.contactsCity}>
          <span className={styles.contactsCityName}>Шымкент</span>
          <Link href="tel:87012667700" className={styles.contactsCityPhone}>
            +7 (701) 266-77-00
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
