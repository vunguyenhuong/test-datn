import React from 'react';
import styles from './Loading.module.css'

function Loading() {
  return (
    <div className="text-center">
        <div className={styles["loading-area"]}>
      <div className={styles.loader}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    </div>
  )
}

export default Loading