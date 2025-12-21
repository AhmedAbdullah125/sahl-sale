'use client';

import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function PhoneField({ value, onChange, onBlur, placeholder }) {
    return (
        <div className="form-group">
            <PhoneInput
                defaultCountry="kw"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputClassName="form-input phone-input"
                className="form-input "
                countrySelectorStyleProps={{
                    className: "phone-country",
                    buttonClassName: "phone-country-btn",
                    dropdownClassName: "phone-country-dropdown",
                }}
                placeholder={placeholder || "000 000 00"}
            />
        </div>
    );
}

