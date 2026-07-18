import UploadFileComponent from "./components/upload-file";

export default function Home() {
  return (
    <div className="h-full flex">
      <div className="w-[40%]  p-2 flex flex-col items-center ">
        <UploadFileComponent />
      </div>

      <div className="flex-1 border-l p-2">2</div>
    </div>
  );
}
