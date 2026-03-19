import MuiAutocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import { IconSearch } from '@tabler/icons-react'
type AutocompleteSimplifiedProps<T> = Omit<
  AutocompleteProps<T, false, false, false>,
  'renderInput'
> & {
  placeholder?: string
}

export const Autocomplete = <T,>({
  placeholder = 'Search...',
  ...props
}: AutocompleteSimplifiedProps<T>) => {
  return (
    <MuiAutocomplete
      autoSelect
      handleHomeEndKeys
      classes={{
        root: ' font-light  ',
        input: 'p-2',
        noOptions: '',
        loading: '',
        listbox: 'p-0 max-h-64',
        option: 'hover:bg-white bg-opacity-100',
        paper:
          ' shadow-md border border-gray-200 mt-1 bg-white rounded-none',
      }}
      renderInput={(params) => (
        <div
          ref={params.InputProps.ref}
          className="flex items-center bg-white"
        >
          <input
            type="text"
            {...params.inputProps}
            className="w-full py-2 pl-3 text-sm pr-8 shadow-none focus:ring-0 border border-gray-200"
            placeholder={placeholder}
          />
          <IconSearch className="w-4 h-4 text-gray-800 stroke-2 -ml-7" />
        </div>
      )}
      {...props}
    />
  )
}
