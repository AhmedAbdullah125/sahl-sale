'use client';

import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface PhoneFieldProps {
    value: string;
    onChange: (phone: string) => void;
    onBlur?: () => void;
    placeholder?: string;
}

export default function PhoneField({ value, onChange, onBlur, placeholder }: PhoneFieldProps) {
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
                    // dropdownClassName: "phone-country-dropdown", // Fix TS error: property does not exist
                }}
                placeholder={placeholder || "000 000 00"}
            />
        </div>
    );
}

