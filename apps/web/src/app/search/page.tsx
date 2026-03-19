'use client'
import { SearchPage } from '@ParkHub/ui/src/components/templates/SearchPage'
import { FormProviderSearchGarage } from '@ParkHub/forms/src/searchGarages'

export default function Page() {
  return (
    <main className="fixed inset-x-0 bottom-0 top-16 z-0 overflow-hidden">
      <FormProviderSearchGarage>
        <SearchPage />
      </FormProviderSearchGarage>
    </main>
  )
}
