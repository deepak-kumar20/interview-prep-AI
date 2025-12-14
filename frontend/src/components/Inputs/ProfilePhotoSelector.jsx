import React from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import { useState } from "react";
import { DEFAULT_AVATAR } from "../../utils/constants";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      if (setPreview) {
        setPreview(preview);
      }
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (setPreview) {
      setPreview(null);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  return  <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={inputRef}
        className="hidden"
      />
      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-[#1e3a5f]/10 rounded-full relative cursor-pointer overflow-hidden">
          <img 
            src={DEFAULT_AVATAR} 
            alt="Default avatar" 
            className="w-full h-full object-cover"
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-[#1e3a5f] text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:bg-[#2d4a6f] transition-colors"
            type="button" 
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            className="w-20 h-20 object-cover rounded-full"
            src={preview || previewUrl} 
            alt="Profile photo" 
          />
          <button
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer hover:bg-red-600 transition-colors"
            type="button" 
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  
};

export default ProfilePhotoSelector;
