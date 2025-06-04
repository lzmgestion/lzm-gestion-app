import React from "react";
import { useDropzone } from "react-dropzone";

export default function SubirImagen({ onImagenCargada }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        onImagenCargada(reader.result);
      };
      reader.readAsDataURL(file);
    }
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 p-4 rounded cursor-pointer text-center hover:bg-gray-100">
      <input {...getInputProps()} />
      <p>Arrastrá o hacé clic para subir imagen</p>
    </div>
  );
}