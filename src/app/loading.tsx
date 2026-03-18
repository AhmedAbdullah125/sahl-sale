import logo from "@/src/images/logo.png";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="loading-contt">

      <svg className="loader" viewBox="0 0 384 384" xmlns="http://www.w3.org/2000/svg">
        <circle
          className="active"
          pathLength="360"
          fill="transparent"
          stroke-width="32"
          cx="192"
          cy="192"
          r="176"
        ></circle>
        <circle
          className="track"
          pathLength="360"
          fill="transparent"
          stroke-width="32"
          cx="192"
          cy="192"
          r="176"
        ></circle>
      </svg>

    </div>
  );
}

export default Loader;
