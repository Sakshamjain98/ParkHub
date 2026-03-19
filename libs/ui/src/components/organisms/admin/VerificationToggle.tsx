import { useMutation } from '@apollo/client'
import {
  CreateVerificationDocument,
  RemoveVerificationDocument,
  namedOperations,
} from '@ParkHub/network/src/gql/generated'

export const VerificationToggle = ({
  garageId,
  verified,
}: {
  garageId: number
  verified: boolean
}) => {
  const [createVerification, { loading: creating }] = useMutation(
    CreateVerificationDocument,
    {
      awaitRefetchQueries: true,
      refetchQueries: [namedOperations.Query.Garages],
    },
  )

  const [removeVerification, { loading: removing }] = useMutation(
    RemoveVerificationDocument,
    {
      awaitRefetchQueries: true,
      refetchQueries: [namedOperations.Query.Garages],
    },
  )

  const loading = creating || removing

  return (
    <button
      type="button"
      disabled={loading}
      className={`inline-flex py-1 items-center rounded-full border px-2 text-[9px] font-semibold leading-none disabled:opacity-60 ${
        verified
          ? 'border-red-300 bg-red-50 text-red-700'
          : 'border-green-300 bg-green-50 text-green-700'
      }`}
      onClick={async () => {
        if (verified) {
          await removeVerification({
            variables: {
              where: { garageId },
            },
          })
          return
        }

        await createVerification({
          variables: {
            createVerificationInput: {
              garageId,
              verified: true,
            },
          },
        })
      }}
      aria-label={verified ? 'Unlist garage verification' : 'Verify garage'}
    >
      {verified ? 'Unlist' : 'Verify'}
    </button>
  )
}