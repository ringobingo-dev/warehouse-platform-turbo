"use client"

import type React from "react"
import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"

interface TreeItemProps {
  label: string
  children?: React.ReactNode
}

export const TreeItem: React.FC<TreeItemProps> = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="ml-4">
      <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {children ? (
          isOpen ? (
            <ChevronDown className="w-4 h-4 mr-1" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1" />
          )
        ) : (
          <div className="w-4 h-4 mr-1" />
        )}
        <span>{label}</span>
      </div>
      {isOpen && children && <div className="ml-4">{children}</div>}
    </div>
  )
}

export const TreeView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mt-2">{children}</div>
}

