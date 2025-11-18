import { useState, useEffect } from 'react';
import { useGetFoodAutocompleteQuery } from '@/slices/fatSecretApiSlice';
import { Search, Loader2 } from 'lucide-react';

interface FoodAutocompleteProps {
    onFoodSelect?: (suggestion: string) => void;
    placeholder?: string;
    className?: string;
}

export const FoodAutoComplete: React.FC<FoodAutocompleteProps> = ({
    onFoodSelect,
    placeholder = "Search for foods...",
    className = ""
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounce search input to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Only make API call if we have a search term with at least 2 characters
    const shouldFetch = debouncedSearch.length >= 2;

    const {
        data: autocompleteResponse,
        error,
        isLoading,
        isFetching
    } = useGetFoodAutocompleteQuery(
        {
            expression: debouncedSearch,
            max_results: 8,
        },
        {
            skip: !shouldFetch
        }
    );

    const suggestions = autocompleteResponse?.success
        ? autocompleteResponse.data.suggestions?.suggestion || []
        : [];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(value.length >= 2);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        onFoodSelect?.(suggestion);
    };

    const handleInputFocus = () => {
        if (searchTerm.length >= 2) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        // Delay hiding suggestions to allow for clicks
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <div className={`relative w-full ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {(isLoading || isFetching) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    ⚠️ Unable to fetch food suggestions. Please check your API configuration.
                </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => {
                        const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.suggestion;
                        return (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestionText)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                            >
                                <span className="text-gray-900 dark:text-gray-100">
                                    {suggestionText}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* No Results Message */}
            {showSuggestions && shouldFetch && !isLoading && !isFetching && suggestions.length === 0 && !error && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                    <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                        No food suggestions found for "{debouncedSearch}"
                    </div>
                </div>
            )}
        </div>
    );
};

// Example usage component
export const FoodAutocompleteExample: React.FC = () => {
    const [selectedFood, setSelectedFood] = useState<string>('');

    const handleFoodSelect = (food: string) => {
        setSelectedFood(food);
        console.log('Selected food:', food);
    };

    return (
        <div className="max-w-md mx-auto p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Food Search
            </h3>

            <FoodAutoComplete
                onFoodSelect={handleFoodSelect}
                placeholder="Type to search for foods..."
                className="mb-4"
            />

            {selectedFood && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Selected:</strong> {selectedFood}
                    </p>
                </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p><strong>Note:</strong> This component requires FatSecret API authentication to work.</p>
                <p>You'll need to implement OAuth 2.0 or set up a server-side proxy for the FatSecret API.</p>
            </div>
        </div>
    );
};

export default FoodAutoComplete;