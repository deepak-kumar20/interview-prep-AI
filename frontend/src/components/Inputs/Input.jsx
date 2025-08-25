import React from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from 'react';


const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

    return (
      <div>
        <label className='text-[13px] text-slate-800'>{label}</label>

        <div className='input-box'>
                <input
                    className='w-full bg-transparent outline-none'
            type={
              type == "password" ? (showPassword ? "text" : "password") : type
            }
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e)}
          />
          {type === "password" && (
            <>
              {showPassword ? (
                            <FaRegEye
                className='text-primary cursor-pointer'
                                size={22} onClick={toggleShowPassword} />
              ) : (
                <FaRegEyeSlash className='text-slate-400 cursor-pointer' size={22} onClick={toggleShowPassword} />
              )}
            </>
          )}
        </div>
      </div>
    );
}

export default Input