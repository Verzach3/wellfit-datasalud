import React from "react";
import { Counter } from "./Counter.js";
import BannerDataSalud from "../../components/DataSalud/BannerDataSalud";
import styles from './page.module.css';

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <BannerDataSalud />  
    </div>
  );
}
