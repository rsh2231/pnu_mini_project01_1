"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoUploadModal({
  onFileSelected,
  onClose,
}: {
  onFileSelected: (file: File) => void;
  onClose: () => void
}) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      onFileSelected(selected); // ✅ 상위에 전달
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl w-full max-w-md max-h-[90vh] p-5 shadow-xl relative overflow-y-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            비디오 선택
          </h2>

          <label
            className="block w-full border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition"
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <p className="text-sm text-gray-700 truncate">{file.name}</p>
            ) : (
              <p className="text-sm text-gray-400">터치해서 비디오 선택</p>
            )}
          </label>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
