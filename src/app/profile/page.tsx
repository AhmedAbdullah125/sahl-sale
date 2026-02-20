import Image from "next/image";

export default function Profile() {
    return (
        <div className="img-empty">
            <Image
                src="/images/freeLogo.png"
                alt="B3"
                className="logo-in-profile"
                width={200}
                height={200}
                priority
            />
        </div>
    );
}
