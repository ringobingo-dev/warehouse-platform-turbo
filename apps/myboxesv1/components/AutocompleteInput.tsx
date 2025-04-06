/**
 * AutocompleteInput Component
 *
 * Purpose: Provides an input field with autocomplete suggestions based on existing values
 *
 * Features:
 * - Displays suggestions as the user types
 * - Allows selection from suggestions
 * - Allows adding new values not in the suggestions
 * - Keyboard navigation support (arrow keys, enter)
 * - Loading state indicator
 *
 * Props:
 * - value: string - The current input value
 * - onChange: (value: string) => void - Callback when value changes
 * - onSelect: (value: string) => void - Callback when a suggestion is selected
 * - suggestions: string[] - Array of suggestion options
 * - placeholder: string - Placeholder text for the input
 * - className: string - Additional CSS classes
 * - required: boolean - Whether the input is required
 *
 * INTEGRATION NOTES:
 * ==================
 * This component is currently using client-side filtering of provided suggestions.
 * The integration team needs to:
 *
 * 1. Implement API endpoint for real-time searching of customers/varieties/grades
 * 2. Update the fetchSuggestions function to call this API endpoint
 * 3. Consider adding debounce to prevent too many API calls
 * 4. Ensure proper error handling for API calls
 */

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/shared/ui/input"
import { cn } from "@/lib/utils"

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  onSelect: (value: string) => void
  suggestions: string[]
  placeholder?: string
  className?: string
  required?: boolean
  label?: string
}

export function AutocompleteInput({
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder = "",
  className = "",
  required = false,
  label,
}: AutocompleteInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Filter suggestions based on input value
  const fetchSuggestions = async (query: string) => {
    setIsLoading(true)

    try {
      // INTEGRATION STEP 1: Replace this with an API call to search database
      // Example API call:
      // const response = await fetch(`/api/search-customers?query=${encodeURIComponent(query)}`);
      // if (!response.ok) throw new Error('Failed to fetch suggestions');
      // const data = await response.json();
      // setFilteredSuggestions(data.results);

      // For now, filter client-side
      const filtered = suggestions.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
      setFilteredSuggestions(filtered)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setFilteredSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)

    if (newValue.trim()) {
      fetchSuggestions(newValue)
      setShowSuggestions(true)
    } else {
      setFilteredSuggestions([])
      setShowSuggestions(false)
    }

    setHighlightedIndex(-1)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    onChange(suggestion)
    onSelect(suggestion)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If no suggestions or not showing suggestions, do nothing
    if (!filteredSuggestions.length || !showSuggestions) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prevIndex) => (prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1))
    }
    // Enter
    else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(filteredSuggestions[highlightedIndex])
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Scroll highlighted suggestion into view
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const highlightedElement = suggestionsRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex])

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.trim() && setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("w-full", className)}
        required={required}
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      )}

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={cn("px-4 py-2 cursor-pointer hover:bg-gray-100", highlightedIndex === index && "bg-gray-100")}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

