import Image from "next/image";
import logo from "@/src/images/logo.png";

export default function Profile() {
    return (
        <div className="img-empty">
            <Image
                src={logo}
                alt="B3"
                className="logo-in-profile"
                width={200}
                height={200}
                priority
            />
        </div>
    );
}
