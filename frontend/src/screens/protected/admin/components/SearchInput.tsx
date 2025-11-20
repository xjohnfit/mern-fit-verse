import { Input } from '@/components/ui/input';
import type { SearchInputProps } from '../admin.types';

const SearchInput = ({ value, onChange, placeholder, className = "max-w-md" }: SearchInputProps) => {
    return (
        <div className="mb-4">
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={className}
            />
        </div>
    );
};

export default SearchInput;
