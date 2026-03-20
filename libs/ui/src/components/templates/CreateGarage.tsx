'use client'
import {
  FormProviderCreateGarage,
  FormTypeCreateGarage,
  useFormCreateGarage,
} from '@ParkHub/forms/src/createGarage'
import { useMutation } from '@apollo/client'
import { useCloudinaryUpload } from '@ParkHub/util/hooks/cloudinary'
import {
  CreateGarageDocument,
  namedOperations,
} from '@ParkHub/network/src/gql/generated'
import { Form } from '../atoms/Form'
import { HtmlLabel } from '../atoms/HtmlLabel'
import { HtmlInput } from '../atoms/HtmlInput'
import { Button } from '../atoms/Button'
import { HtmlTextArea } from '../atoms/HtmlTextArea'
import { ImagePreview } from '../organisms/ImagePreview'
import { Controller } from 'react-hook-form'
import { Map } from '../organisms/map/Map'
import { initialViewState } from '@ParkHub/util/constants'
import { Panel } from '../organisms/map/Panel'
import { SearchPlaceBox } from '../organisms/map/SearchPlacesBox'
import { ViewState } from '@ParkHub/util/types'
import { CenterOfMap, DefaultZoomControls } from '../organisms/map/ZoomControls'
import { useFormContext } from 'react-hook-form'
import { AddSlots, GarageMapMarker } from '../organisms/CreateGarageComponents'
import { ToastContainer, toast } from '../molecules/Toast'
import { useRouter } from 'next/navigation'

const CreateGarageContent = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
    resetField,
    watch,
  } = useFormContext<FormTypeCreateGarage>()

  const { images } = watch()

  const { uploading, upload } = useCloudinaryUpload()
  const router = useRouter()

  const [createGarage, { data, error, loading }] = useMutation(
    CreateGarageDocument,
    {
      refetchQueries: [namedOperations.Query.Garages],
      onCompleted: () => {
        reset()
        toast('Garage created successfully.')
        router.push('/')
      },
      onError(error, clientOptions) {
        toast('Action failed.')
      },
    },
  )

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-4 pb-4">
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-5">
          <Form
            onSubmit={handleSubmit(
              async ({
                images,
                description,
                displayName,
                location,
                slotTypes,
              }) => {
                const uploadedImages = await upload(images)

                const result = await createGarage({
                  variables: {
                    createGarageInput: {
                      Address: location,
                      images: uploadedImages,
                      Slots: slotTypes,
                      description,
                      displayName,
                    },
                  },
                })
              },
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-black">Create New Garage</h2>
                <p className="text-xs text-gray-500 mt-1">Set up your parking facility</p>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <HtmlLabel error={errors.displayName?.message} title="Display Name">
                    <HtmlInput 
                      {...register('displayName')} 
                      placeholder="e.g. Downtown Parking Hub" 
                    />
                  </HtmlLabel>
                  <HtmlLabel title="Description" error={errors.description?.message}>
                    <HtmlTextArea
                      cols={4}
                      {...register('description')}
                      placeholder="Describe your garage facilities, amenities, etc."
                    />
                  </HtmlLabel>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
                  Location
                </h3>
                <HtmlLabel title="Address" error={errors.location?.address?.message}>
                  <HtmlTextArea
                    cols={3}
                    {...register('location.address')}
                    placeholder="123, Main Street, City, State"
                  />
                </HtmlLabel>
                <p className="text-xs text-gray-500">Or use the map on the right to select location</p>
              </div>
            </div>

            {/* Images Section */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">3</span>
                  Gallery
                </h3>
                <label className="block text-xs text-gray-600 font-medium">Upload garage photos</label>
                <ImagePreview srcs={images} clearImage={() => resetField('images')}>
                  <Controller
                    control={control}
                    name={`images`}
                    render={({ field }) => (
                      <HtmlInput
                        type="file"
                        accept="image/*"
                        multiple={true}
                        onChange={(e) => field.onChange(e?.target?.files)}
                        className="border-0"
                      />
                    )}
                  />
                </ImagePreview>
              </div>
            </div>

            {/* Parking Slots Section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">4</span>
                Parking Slots
              </h3>
              <AddSlots />
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 pt-4">
              <Button 
                loading={uploading || loading} 
                type="submit" 
                className="w-full py-2.5"
              >
                {uploading || loading ? 'Creating...' : 'Create Garage'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <Map
        initialViewState={initialViewState}
        onLoad={(e) => {
          const { lat, lng } = e.target.getCenter()
          setValue('location.lat', lat)
          setValue('location.lng', lng)
        }}
      >
        <GarageMapMarker />
        <Panel position="left-top">
          <SearchPlaceBox
            onLocationChange={(location: ViewState) => {
              setValue('location.lat', location.latitude)
              setValue('location.lng', location.longitude)
            }}
          />
          <DefaultZoomControls>
            <CenterOfMap
              onClick={(latLng) => {
                const lat = parseFloat(latLng.lat.toFixed(8))
                const lng = parseFloat(latLng.lng.toFixed(8))

                setValue('location.lat', lat, {
                  shouldValidate: true,
                })
                setValue('location.lng', lng, {
                  shouldValidate: true,
                })
              }}
            />
          </DefaultZoomControls>
        </Panel>
      </Map>
    </div>
  )
}

export const CreateGarage = () => {
  return (
    <FormProviderCreateGarage>
      <CreateGarageContent />
    </FormProviderCreateGarage>
  )
}
