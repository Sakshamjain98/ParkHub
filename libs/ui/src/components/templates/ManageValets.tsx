'use client'
import { AddValet } from '../organisms/AddValet'
import { ListValets } from '../organisms/ListValets'

export const ManageValets = () => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex justify-end rounded-lg border border-gray-200 bg-white p-2 shadow-sm sm:p-3">
        <AddValet />
      </div>
      <ListValets />
    </div>
  )
}
