'use client'
import { SearchPage } from '@ParkHub/ui/src/components/templates/SearchPage'
import { FormProviderSearchGarage } from '@ParkHub/forms/src/searchGarages'

export default function Page() {
  return (
    <FormProviderSearchGarage>
      <SearchPage />
    </FormProviderSearchGarage>
  )
}
