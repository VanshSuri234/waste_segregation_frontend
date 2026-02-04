import React, { useState } from 'react';
import { Paperclip, Send, X } from 'lucide-react';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text && !file) return;
    onSend(text, file);
    setText("");
    setFile(null);
  };

  return (
    <div className="p-4 border-t bg-white">
      {file && (
        <div className="mb-2 flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 w-fit">
          <span className="text-xs text-emerald-700 truncate max-w-[150px]">{file.name}</span>
          <button type="button" onClick={() => setFile(null)} className="text-red-500 hover:text-red-700"><X size={14} /></button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <label className="cursor-pointer text-emerald-600 hover:bg-emerald-100 p-2 rounded-full transition-colors">
          <Paperclip size={20} />
          <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Which bin does this go in?"
          className="flex-1 p-2 outline-none rounded-lg border border-emerald-100 focus:border-emerald-500"
        />
        <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 active:scale-95 transition-all">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}