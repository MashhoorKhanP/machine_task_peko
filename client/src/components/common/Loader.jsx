import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className="w-full h-full z-50 grid place-content-center fixed top-0 left-0 bg-white bg-opacity-40 flex-center">
      <div className="flex justify-center">
        <div className={styles.loading}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;