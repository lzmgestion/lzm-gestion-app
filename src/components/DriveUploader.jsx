import React, { useEffect } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "4347466477-001k4fjnqjk496362as88u893jbvdtdr.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

export default function DriveUploader({ data }) {
  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    });
  }, []);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      console.log("Sesión iniciada");
    });
  };

  const subirArchivo = () => {
    const archivo = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const metadata = {
      name: "clientes-lzm.json",
      mimeType: "application/json",
    };

    const accessToken = gapi.auth.getToken().access_token;

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", archivo);

    fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: new Headers({ Authorization: "Bearer " + accessToken }),
      body: form,
    })
      .then((res) => res.json())
      .then((val) => {
        alert("Archivo subido con éxito");
        console.log(val);
      })
      .catch((err) => console.error("Error al subir:", err));
  };

  return (
    <div className="text-center mt-4">
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
        Iniciar sesión con Google
      </button>
      <button onClick={subirArchivo} className="bg-green-600 text-white px-4 py-2 rounded">
        Subir a Drive
      </button>
    </div>
  );
}