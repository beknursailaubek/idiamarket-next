import { useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CityContext } from "@/context/CityContext";
import styles from "./Location.module.css";
import Image from "next/image";

import { City } from "@/types";

interface LocationProps {
  closeModal: () => void;
}

const Location: React.FC<LocationProps> = ({ closeModal }) => {
  const cityContext = useContext(CityContext);
  if (!cityContext) {
    throw new Error("CityContext must be used within its provider");
  }
  const { selectedCity, cities, setSelectedCity } = cityContext;

  const router = useRouter();
  const pathname = usePathname();

  const handleSetSelectedCity = setSelectedCity ?? (() => {});

  const handleCitySelect = (city: City) => {
    handleSetSelectedCity(city);

    if (!pathname) {
      console.error("Pathname is undefined.");
      return;
    }

    // Ensure `cities` is not `undefined` and safely handle it
    const pathSegments = pathname.split("/").filter((segment) => (cities || []).some((c: City) => c.uri === segment));

    const newUri = city.uri ? `/${city.uri}/${pathSegments.join("/")}` : `/${pathSegments.join("/")}`;

    router.push(newUri);

    closeModal();
  };

  return (
    <div className={styles.locationModal}>
      <div className={styles.locationModalContent}>
        <p className={styles.locationModalTitle}>Выберите город</p>
        <p className={styles.locationModalText}>Выбор города поможет вам узнать о наличии товара и условиях доставки</p>
        <div className={styles.locationModalCities}>
          {cities?.map((city: City) => (
            <button key={city.code} onClick={() => handleCitySelect(city)} className={`${styles.locationModalCity} ${city.code === selectedCity?.code ? styles.locationModalCityActive : ""}`}>
              {city.title}
              {city.code === selectedCity?.code ? <Image className={styles.locationModalCityIcon} src="/images/icons/done.svg" alt="" width={24} height={24} /> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Location;
