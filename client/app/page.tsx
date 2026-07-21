import ChatInput from "./components/chat-input";
import UploadFileComponent from "./components/upload-file";

export default function Home() {
  return (
    <div className="h-full flex">
      <div className="w-[30%]  p-2 flex flex-col items-center justify-center gap-4 border-r ">
        <UploadFileComponent />    
      </div>
      <div className="flex-1 relative pt-16">
        <ChatInput/> 
      </div>
    </div>
  );
}
