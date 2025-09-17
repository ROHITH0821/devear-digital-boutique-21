import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface SearchFiltersProps {
  filters: {
    categories: string[];
    sizes: string[];
    colors: string[];
    priceRange: [number, number];
    sortBy: string;
  };
  onFiltersChange: (filters: any) => void;
  availableFilters: {
    categories: string[];
    sizes: string[];
    colors: string[];
    maxPrice: number;
  };
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  availableFilters
}) => {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (key: 'categories' | 'sizes' | 'colors', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, availableFilters.maxPrice],
      sortBy: 'relevance',
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.colors.length > 0) count += filters.colors.length;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < availableFilters.maxPrice) count += 1;
    return count;
  };

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popularity', label: 'Most Popular' },
  ];

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          {getActiveFilterCount() > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sort By */}
        <div>
          <h4 className="font-medium mb-3">Sort By</h4>
          <div className="space-y-2">
            {sortOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={filters.sortBy === option.value}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value)}
              max={availableFilters.maxPrice}
              step={10}
              className="mb-3"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h4 className="font-medium mb-3">Categories</h4>
          <div className="space-y-2">
            {availableFilters.categories.map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleArrayFilter('categories', category)}
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sizes */}
        <div>
          <h4 className="font-medium mb-3">Sizes</h4>
          <div className="flex flex-wrap gap-2">
            {availableFilters.sizes.map(size => (
              <Button
                key={size}
                variant={filters.sizes.includes(size) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleArrayFilter('sizes', size)}
                className="h-8 px-3"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Colors */}
        <div>
          <h4 className="font-medium mb-3">Colors</h4>
          <div className="grid grid-cols-4 gap-2">
            {availableFilters.colors.map(color => (
              <button
                key={color}
                onClick={() => toggleArrayFilter('colors', color)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  filters.colors.includes(color) 
                    ? 'border-primary shadow-md' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;