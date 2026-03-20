import { useFormCreateManySlots } from '@ParkHub/forms/src/createSlots'
import { useMutation, useQuery } from '@apollo/client'
import {
  CreateManySlotsDocument,
  GaragesDocument,
  SlotType,
  namedOperations,
} from '@ParkHub/network/src/gql/generated'
import { useState } from 'react'
import { Button } from '../atoms/Button'
import { Dialog } from '../atoms/Dialog'
import { HtmlLabel } from '../atoms/HtmlLabel'
import { HtmlSelect } from '../atoms/HtmlSelect'
import { HtmlInput } from '../atoms/HtmlInput'
import { Form } from '../atoms/Form'
import { toast } from '../molecules/Toast'
import Image from 'next/image'
import { IconPhoto, IconX } from '@tabler/icons-react'

export const CreateManySlotsDialog = ({ garageId }: { garageId: number }) => {
  const [open, setOpen] = useState(false)
  const [showGallery, setShowGallery] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormCreateManySlots()

  const { data: garageData } = useQuery(GaragesDocument, {
    variables: {
      where: { id: { equals: garageId } },
      take: 1,
    },
    skip: !open,
  })

  const garage = garageData?.garages?.[0]
  const images = garage?.images || []

  const [createManySlots, { loading, data, error }] = useMutation(
    CreateManySlotsDocument,
    {
      awaitRefetchQueries: true,
      refetchQueries: [namedOperations.Query.Garages],
      onCompleted(data, clientOptions) {
        setOpen(false)
        toast('Slots created successfully.')
      },
      onError(error, clientOptions) {
        toast('Action failed.')
      },
    },
  )

  return (
    <>
      <Button
        variant="outlined"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex-1"
      >
        + Add Slots
      </Button>
      <Dialog open={open} setOpen={setOpen} title={'Create slots'} widthClassName="max-w-2xl">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Image gallery section */}
          <div className="flex flex-col gap-3">
            {images.length > 0 ? (
              <>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={images[0]}
                    alt="Garage"
                    fill
                    className="object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => setShowGallery(true)}
                    className="flex items-center justify-center gap-2"
                  >
                    <IconPhoto className="w-4 h-4" />
                    View Gallery ({images.length})
                  </Button>
                )}
              </>
            ) : (
              <div className="w-full aspect-video rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{garage?.displayName}</span>
              </p>
              {garage?.address && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {garage.address.address}
                </p>
              )}
            </div>
          </div>

          {/* Form section */}
          <Form
            onSubmit={handleSubmit(async ({ count, ...data }) => {
              await createManySlots({
                variables: { count, createSlotInput: { ...data, garageId } },
              })
            })}
          >
            <div className="grid grid-cols-1 gap-3">
              <HtmlLabel title="Slot type" error={errors.type?.toString()}>
                <HtmlSelect placeholder="Slot type" {...register(`type`)}>
                  {Object.values(SlotType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </HtmlSelect>
              </HtmlLabel>
              <HtmlLabel title="Price/hr" error={errors.pricePerHour?.message}>
                <HtmlInput
                  type="number"
                  placeholder="Price per hour"
                  {...register(`pricePerHour`, {
                    valueAsNumber: true,
                  })}
                />
              </HtmlLabel>
              <HtmlLabel title="Number of slots" error={errors.count?.message}>
                <HtmlInput
                  type="number"
                  placeholder="Enter the number of slots"
                  {...register(`count`, {
                    valueAsNumber: true,
                  })}
                />
              </HtmlLabel>
              <HtmlLabel title="Length" error={errors.length?.message}>
                <HtmlInput
                  type="number"
                  placeholder="Enter the length in ft"
                  {...register('length', {
                    valueAsNumber: true,
                  })}
                />
              </HtmlLabel>
              <HtmlLabel title="Width" error={errors.width?.message}>
                <HtmlInput
                  type="number"
                  placeholder="Enter the width in ft"
                  {...register(`width`, {
                    valueAsNumber: true,
                  })}
                />
              </HtmlLabel>
              <HtmlLabel title="Height" error={errors.height?.message}>
                <HtmlInput
                  type="number"
                  placeholder="Enter the height in ft"
                  {...register(`height`, {
                    valueAsNumber: true,
                  })}
                />
              </HtmlLabel>
              <Button type="submit" loading={loading} className="w-full">
                Create Slots
              </Button>
            </div>
          </Form>
        </div>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={showGallery} setOpen={setShowGallery} title={'Garage Gallery'} widthClassName="max-w-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group cursor-pointer">
              <Image
                src={image}
                alt={`Garage image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </Dialog>
    </>
  )
}
