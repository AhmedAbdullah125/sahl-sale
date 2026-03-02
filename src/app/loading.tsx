import logo from "@/src/images/logo.png";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="loading-container">
      <Image src={logo} alt="Logo" width={100} height={100} className="object-contain" priority />
    </div>
  );
}

export default Loader;
