import { useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CityContext } from "@/context/CityContext";
import styles from "./Location.module.css";
import Image from "next/image";

interface City {
  code: string;
  title: string;
  uri: string;
}

interface LocationProps {
  closeModal: () => void;
}

const Location: React.FC<LocationProps> = ({ closeModal }) => {
  const { selectedCity, setSelectedCity, cities } = useContext(CityContext);
  const router = useRouter();
  const pathname = usePathname(); // Getting the current pathname

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);

    if (!pathname) {
      console.error("Pathname is undefined.");
      return;
    }

    // Remove any existing city URIs from the path
    const pathSegments = pathname.split("/").filter((segment) => !cities.some((c) => c.uri === segment));

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
          {cities.map((city: City) => (
            <button key={city.code} onClick={() => handleCitySelect(city)} className={`${styles.locationModalCity} ${city.code === selectedCity.code ? styles.locationModalCityActive : ""}`}>
              {city.title}
              {city.code === selectedCity.code ? <Image className={styles.locationModalCityIcon} src="/images/icons/done.svg" alt="" width={24} height={24} /> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Location;
