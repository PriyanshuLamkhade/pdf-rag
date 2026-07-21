"use client"
import { Upload } from "lucide-react";
import * as React from "react";

const UploadFileComponent: React.FC = () => {
  const handleFileUploadButtonClick = () => {
    const el = document.createElement('input')
    el.setAttribute('type','file')
    el.setAttribute('accept','application/pdf')
    el.addEventListener('change',async (ev)=>{
       if(el.files && el.files.length > 0){
        const file = el.files.item(0)
        if(file){
          const formData = new FormData()
          formData.append('pdf',file)

          await fetch('http://localhost:8000/upload/pdf',{
            method:'POST',
            body:formData
          })
          console.log("file uploaded")
        }
       }  
    })
    el.click()
  };
  return (
    <div
      className="fixed sm:w-[24vw] cursor-pointer flex flex-col top-70 justify-center items-center p-4 border bg-gray-800 rounded-xl 
      font-bold sm:text-2xl text-xl text-center gap-2 hover:shadow-md hover:shadow-gray-400 hover:-translate-y-0.5 transition-all "
      onClick={handleFileUploadButtonClick}
    >
      <h1>Upload PDF</h1>
      <Upload size={50} />
    </div>
  );
};

export default UploadFileComponent;
