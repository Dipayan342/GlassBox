"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, SlidersHorizontal } from "lucide-react"

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface SearchFilterProps {
  placeholder?: string
  filters?: {
    [key: string]: FilterOption[]
  }
  onSearch?: (query: string) => void
  onFilterChange?: (filters: Record<string, string[]>) => void
  showAdvanced?: boolean
}

export function SearchFilter({
  placeholder = "Search...",
  filters = {},
  onSearch,
  onFilterChange,
  showAdvanced = false,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const toggleFilter = (category: string, filterId: string) => {
    const newFilters = { ...activeFilters }
    if (!newFilters[category]) {
      newFilters[category] = []
    }

    const index = newFilters[category].indexOf(filterId)
    if (index > -1) {
      newFilters[category].splice(index, 1)
      if (newFilters[category].length === 0) {
        delete newFilters[category]
      }
    } else {
      newFilters[category].push(filterId)
    }

    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearFilters = () => {
    setActiveFilters({})
    onFilterChange?.({})
  }

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((sum, filters) => sum + filters.length, 0)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-12"
        />
        {Object.keys(filters).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {getActiveFilterCount() > 0 && <Badge className="ml-1 h-5 w-5 p-0 text-xs">{getActiveFilterCount()}</Badge>}
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Object.entries(activeFilters).map(([category, filterIds]) =>
            filterIds.map((filterId) => {
              const filter = filters[category]?.find((f) => f.id === filterId)
              return (
                <Badge key={`${category}-${filterId}`} variant="secondary" className="flex items-center gap-1">
                  {filter?.label}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleFilter(category, filterId)} />
                </Badge>
              )
            }),
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && Object.keys(filters).length > 0 && (
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(filters).map(([category, options]) => (
                <div key={category}>
                  <h4 className="font-medium mb-2 capitalize">{category}</h4>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters[category]?.includes(option.id) || false}
                          onChange={() => toggleFilter(category, option.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{option.label}</span>
                        {option.count && <span className="text-xs text-gray-500">({option.count})</span>}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
