import React, { useState } from "react";
import styles from "./index.less";
import Address  from '../AddressSelectModal';

export default function IndexPage() {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(props.city || "");
  const [district, setDistrict] = useState(props.district || "");
  const [streetName, setStreetName] = useState(props.streetName || "");
  const [addressVisible, setAddressVisible] = useState(false);
  const handleAddress = (result: { city?: string; district?: string; streetName?: string }) => {
    setAddress([result.city || "", result.district || "", result.streetName || ""].join(" "));
    setCity(result.city || "");
    setDistrict(result.district || "");
    setStreetName(result.streetName || "");
  };
  return (
    <div>
      点击选择
      <div className={styles.selectBox} onClick={() => {setAddressVisible(true)}}>
        {currentValue}
      </div>
      <Address hierarchy={3} getAddress={handleAddress} closeModel={() => {setAddressVisible(false)}} visible={addressVisible}/>
    </div>
  );
}
