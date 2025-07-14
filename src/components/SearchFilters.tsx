import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";
import { ResumeService, type SearchFilters } from "@/services/resumeService";

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

const SearchFiltersComponent = ({ onFiltersChange, className = "" }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const [filterOptions, setFilterOptions] = useState({
    companies: [] as string[],
    roles: [] as string[],
    industries: [] as string[],
    experienceLevels: [] as string[],
  });

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    const filters: SearchFilters = {
      searchQuery: searchQuery || undefined,
      company: selectedCompany || undefined,
      role: selectedRole || undefined,
      industry: selectedIndustry || undefined,
      experienceLevel: selectedExperience || undefined,
    };
    onFiltersChange(filters);
  }, [searchQuery, selectedCompany, selectedRole, selectedIndustry, selectedExperience, onFiltersChange]);

  const loadFilterOptions = async () => {
    const options = await ResumeService.getFilterOptions();
    setFilterOptions(options);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCompany("");
    setSelectedRole("");
    setSelectedIndustry("");
    setSelectedExperience("");
  };

  const hasActiveFilters = searchQuery || selectedCompany || selectedRole || selectedIndustry || selectedExperience;

  const FilterBubble = ({ 
    options, 
    selected, 
    onSelect, 
    placeholder 
  }: { 
    options: string[]; 
    selected: string; 
    onSelect: (value: string) => void; 
    placeholder: string;
  }) => (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium text-gray-700 py-2 min-w-fit">{placeholder}:</span>
      <div className="flex flex-wrap gap-2">
        {options.slice(0, 10).map((option) => (
          <Badge
            key={option}
            variant={selected === option ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selected === option 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onSelect(selected === option ? "" : option)}
          >
            {option}
            {selected === option && <X className="w-3 h-3 ml-1" />}
          </Badge>
        ))}
        {options.length > 10 && (
          <Badge variant="outline" className="cursor-default">
            +{options.length - 10} more
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <div className={`bg-white border rounded-lg p-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search resumes by title, company, role, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-lg"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {[selectedCompany, selectedRole, selectedIndustry, selectedExperience].filter(Boolean).length}
            </Badge>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearAllFilters} className="text-sm">
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Bubbles */}
      {showFilters && (
        <div className="space-y-4">
          {filterOptions.companies.length > 0 && (
            <FilterBubble
              options={filterOptions.companies}
              selected={selectedCompany}
              onSelect={setSelectedCompany}
              placeholder="Company"
            />
          )}
          
          {filterOptions.roles.length > 0 && (
            <FilterBubble
              options={filterOptions.roles}
              selected={selectedRole}
              onSelect={setSelectedRole}
              placeholder="Role"
            />
          )}
          
          {filterOptions.industries.length > 0 && (
            <FilterBubble
              options={filterOptions.industries}
              selected={selectedIndustry}
              onSelect={setSelectedIndustry}
              placeholder="Industry"
            />
          )}
          
          {filterOptions.experienceLevels.length > 0 && (
            <FilterBubble
              options={filterOptions.experienceLevels}
              selected={selectedExperience}
              onSelect={setSelectedExperience}
              placeholder="Experience Level"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFiltersComponent;