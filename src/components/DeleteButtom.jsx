import React from 'react'
import { Trash2 } from 'lucide-react'
const DeleteButtom = () => {
  return (
    <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#730f06] text-white rounded-md hover:bg-[#b08562] transition-colors"
      >
        <Trash2 size={20} />
        Eliminar elemento
      </button>
  )
}

export default DeleteButtom
