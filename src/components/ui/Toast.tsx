
import type { IToast } from '@/types/toasts';

interface IToastProps {
    toast: IToast;
    onDismiss: (id: string) => void;
}

export default function Toast({ toast, onDismiss }: IToastProps) {
    const { id, type, title, content, dataCy } = toast;

    const baseClasses = "p-4 rounded-md shadow-lg text-white mb-2";
    const typeClasses = {
        SUCCESS: "bg-green-500",
        ERROR: "bg-red-500",
        WARNING: "bg-yellow-500",
    };

    return (
        <div data-cy={dataCy ? `t-${dataCy}`: undefined} className={`${baseClasses} ${typeClasses[type]}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold">{title}</p>
                    <p>{content}</p>
                </div>
                <button onClick={() => onDismiss(id)} className="ml-4 text-white">X</button>
            </div>
        </div>
    );
}
