import { Loader } from "lucide-react";

const SubmittingLoader = ({ status }: { status: string }) => {
  return (
    <div className="fixed inset-0 z-2 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <div className="flex h-20 max-w-80 items-center justify-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
        <Loader className="mb-2 h-8 w-8 animate-spin text-green-500" />
        <p className="text-lighttext text-sm font-medium">
          {status}...please wait
        </p>
      </div>
    </div>
  );
};

export default SubmittingLoader;
