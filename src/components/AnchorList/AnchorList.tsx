import Link from "next/link";
import { Anchor } from "@/types";
import { useCityContext } from "@/hooks/useCityContext";
import styles from "./AnchorList.module.css";

interface AnchorListProps {
  items: Anchor[];
}

const AnchorList = ({ items }: AnchorListProps) => {
  const { selectedCity } = useCityContext();
  const cityPrefix = selectedCity?.uri ? `/${selectedCity.uri}` : "";

  return (
    <div className={styles.body}>
      <p className={styles.title}>Похожие запросы</p>
      <div className={styles.list}>
        {items.map((item, index) => (
          <Link className={styles.link} href={`${cityPrefix}/${item.uri}`} key={index}>
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AnchorList;
