'use client'
import { useCallback } from 'react'
import { Map } from '../organisms/map/Map'
import { Panel } from '../organisms/map/Panel'
import { DefaultZoomControls } from '../organisms/map/ZoomControls'
import { ViewStateChangeEvent } from 'react-map-gl/maplibre'
import { initialViewState } from '@ParkHub/util/constants'
import { SearchPlaceBox } from '../organisms/map/SearchPlacesBox'
import { useFormContext } from 'react-hook-form'
import { FormTypeSearchGarage } from '@ParkHub/forms/src/searchGarages'
import { IconType } from '../molecules/IconTypes'
import { IconArrowDown } from '@tabler/icons-react'
import { HtmlInput } from '../atoms/HtmlInput'
import { toLocalISOString } from '@ParkHub/util/date'
import { ShowGarages } from '../organisms/search/ShowGarages'
import { FilterSidebar } from '../organisms/search/FilterSidebar'

export const SearchPage = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext<FormTypeSearchGarage>()
  const formData = watch()

  const handleMapChange = useCallback(
    (target: ViewStateChangeEvent['target']) => {
      const bounds = target.getBounds()
      const locationFilter = {
        ne_lat: bounds?.getNorthEast().lat || 0,
        ne_lng: bounds?.getNorthEast().lng || 0,
        sw_lat: bounds?.getSouthWest().lat || 0,
        sw_lng: bounds?.getSouthWest().lng || 0,
      }
      setValue('locationFilter', locationFilter)
    },
    [setValue],
  )

  return (
    <Map
      height="100%"
      onLoad={(e) => handleMapChange(e.target)}
      onDragEnd={(e) => handleMapChange(e.target)}
      onZoomEnd={(e) => handleMapChange(e.target)}
      initialViewState={initialViewState}
    >
      <ShowGarages />
      <Panel position="left-top">
        <div className="flex max-w-[22rem] flex-col items-stretch gap-2">
          <SearchPlaceBox />
          <div className="relative flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <IconArrowDown className="p-1 text-gray-500" />
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2">
              <IconType time={formData.startTime} />
              <HtmlInput
                type="datetime-local"
                className="w-full border-0 bg-transparent py-2 text-sm font-medium"
                min={toLocalISOString(new Date()).slice(0, 16)}
                {...register('startTime', {
                  onChange(event) {
                    trigger('startTime')
                    trigger('endTime')
                  },
                })}
              />
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2">
              <IconType time={formData.endTime} />
              <HtmlInput
                min={toLocalISOString(new Date()).slice(0, 16)}
                type="datetime-local"
                className="w-full border-0 bg-transparent py-2 text-sm font-medium"
                {...register('endTime', {
                  onChange(event) {
                    trigger('endTime')
                  },
                })}
              />
            </div>
          </div>
        </div>
      </Panel>
      <Panel position="right-center">
        <DefaultZoomControls />
      </Panel>
      {errors ? (
        <Panel position="center-bottom">
          {Object.entries(errors).map(([key, value]) => {
            return (
              <div
                className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-800 shadow-sm"
                key={key}
              >
                {key}: {value.message}
              </div>
            )
          })}
        </Panel>
      ) : null}
      <Panel position="right-top">
        <FilterSidebar />
      </Panel>
    </Map>
  )
}
